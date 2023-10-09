import { RowDataPacket } from "mysql2";
import { db } from "../db";
import { Message } from "../types/message.type";
import { LinkerChannelMessagesModel } from "./linker_channel_messages.model";

export class MessageModel {

    public static table_name = 'message';
    
    public static getAll():Promise<Message[]> {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM ${this.table_name}`,
                (err, res) => {
                    if (err) reject(err);
                    const rows = <RowDataPacket[]> res;
                    const messages: Message[] = [];

                    rows.forEach(row => 
                        messages.push(
                            new Message(
                                row.id, 
                                row.id_sender, 
                                row.content, 
                                row.content_type
                            )
                        )
                    );
                    resolve(messages)
                }
            )
        });
    }

    public static getOne(id:Number):Promise<Message> {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM ${this.table_name} WHERE id = ?`,
                [id],
                (err, res) => {
                    if (err) reject(err);
                    const row  = (<RowDataPacket> res)[0];
                    try {
                        const message = new Message(
                            row.id, 
                            row.id_sender, 
                            row.content, 
                            row.content_type
                        );
                        resolve(message);
                    } catch(error) {
                        reject(`${this.table_name} not found`)
                    }
                }
            )
        });
    }

    public static getMessagesByChannel(channel_id:Number)
    {
        return new Promise((resolve, reject) => {
            db.query(`
                SELECT 
                    user.username, 
                    message.content, 
                    message.content_type 
                FROM 
                    ${this.table_name} 
                INNER JOIN 
                    user 
                ON 
                    message.id_sender = user.id
                WHERE message.id IN (
                    SELECT id_message
                    FROM linker_channel_messages
                    WHERE id_channel = ?
                )`,
                [channel_id],
                (err, res) => {
                    if (err) reject(err);
                    const row  = (<RowDataPacket> res)[0];
                    try {
                        const message = {
                            username: row.username, 
                            content: row.content, 
                            content_type: row.content_type
                        };
                        resolve(message);
                    } catch(error) {
                        reject(`${this.table_name} not found`)
                    }
                }
            )
        });
    }

    public static create(message:Message):Promise<any> {
        return new Promise((resolve, reject) => {
            // Add message to database
            db.query(
                `INSERT INTO ${this.table_name} 
                    (id_sender, content, content_type, timestamp) 
                VALUES (?, ?, ?, ?)`,
                [message.id_sender, message.content, message.content_type, this.dateNow()],
                (err, res) => {
                    if (err) reject(err);
                    resolve(res);
                }
            );
        });
    }

    public static update(id:Number, message:Message):Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.query(
                `UPDATE ${this.table_name} SET id_sender = ?, content = ? WHERE id = ?`,
                [message.id_sender, message.content, id],
                (err, res) => {
                    if (err) reject(err);
                    resolve(true);
                }
            )
        });
    }

    public static delete(id:Number):Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.query(
                `DELETE FROM ${this.table_name} WHERE id = ?`,
                [id],
                (err, res) => {

                    if (err) reject(err);

                    // delete linkers to message -> channel
                    this.deleteFromLinkers(id)
                    .then(data => resolve(true))
                    .catch(err => reject(err));
                }
            );
        });
    }

    private static deleteFromLinkers(id:Number):Promise<boolean> {
        return LinkerChannelMessagesModel.deleteByMessage(id);
    }

    private static dateNow():string
    {
        const date = new Date();
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    }

}
