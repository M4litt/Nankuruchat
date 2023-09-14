import { RowDataPacket } from "mysql2";
import { db } from "../db";
import { Message } from "../types/message.type";

const table_name = 'message';

export class MessageModel {
    
    public static getAll():Promise<Message[]> {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM ${table_name}`,
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
                `SELECT * FROM ${table_name} WHERE id = ?`,
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
                        reject(`${table_name} not found`)
                    }
                }
            )
        });
    }

    public static create(message:Message):Promise<boolean> {
        return new Promise((resolve, reject) => {
            // Add message to database
            db.query(
                `INSERT INTO ${table_name} (id_sender, content, content_type) VALUES (?, ?, ?)`,
                [message.id_sender, message.content, message.content_type],
                (err, res) => {
                    if (err) reject(err);
                    resolve(true);
                }
            );

            // add message to server
            /* TODO */
            return;
            db.query(
                "SELECT LAST_INSERT_ID()",
                (err, res) => {
                    if (err) reject(err);
                    const row  = (<RowDataPacket> res)[0];
                    console.log('Last insert id',row.id);
                }
            );
        });
    }

    public static update(id:Number, message:Message):Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.query(
                `UPDATE ${table_name} SET id_sender = ?, content = ? WHERE id = ?`,
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
                `DELETE FROM ${table_name} WHERE id = ?`,
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
        return new Promise((resolve, reject) => {
            db.query(
                `DELETE * FROM linker_channel_messages WHERE id_message = ?`,
                [id],
                (err, res) => {
                    if (err) reject(err);
                    resolve(true);
                }
            )
        });
    }

    public static getLastInsertID():Promise<Number> {
        return new Promise((resolve, reject) => {
            db.query(
                "SELECT LAST_INSERT_ID()",
                (err, res) => {
                    if (err) reject(err);
                    const row  = (<RowDataPacket> res)[0];
                    resolve(row.id);
                }
            );
        })
    }

}