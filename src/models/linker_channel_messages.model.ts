import { RowDataPacket } from "mysql2";
import { db } from "../db";
import { Message } from "../types/message.type";
import { MessageModel } from "./message.model";


export class LinkerChannelMessagesModel {

    public static table_name = "linker_channel_messages";
    
    public static create(id_channel: Number, id_message:Number): Promise<any> {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO ${this.table_name} (id_channel, id_message) VALUES (?, ?)`,
                [id_channel, id_message],
                (err, res) => {
                    if (err) reject(err);
                    resolve(res);
                }
            )
        });
    }

    public static deleteByChannel(id_channel: Number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.query(
                `DELETE FROM ${this.table_name} WHERE id_channel = ?`,
                [id_channel],
                (err, res) => {
                    if (err) reject(err);
                    resolve(true);
                }
            )
        });
    }

    public static deleteByMessage(id_message: Number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.query(
                `DELETE FROM ${this.table_name} WHERE id_message = ?`,
                [id_message],
                (err, res) => {
                    if (err) reject(err);
                    resolve(true);
                }
            )
        });
    }
    
    // extras

    public static getMessagesByChannel(id_channel:Number): Promise<any[]> {
        return new Promise((resolve, reject) => {

            db.query(
                `
                SELECT 
                    user.username,
                    user.pfp,
                    message.content,
                    message.content_type,
                    message.timestamp
                FROM 
                    message
                INNER JOIN
                    user
                ON
                    message.id_sender = user.id
                WHERE
                    message.id IN (
                        SELECT id_message FROM linker_channel_messages WHERE id_channel = ?
                    )
                ORDER BY message.timestamp DESC
                LIMIT 10
                `
                ,
                [id_channel],
                (err, res) => {
                    if (err) reject(err);

                    const rows = <RowDataPacket[]> res;
                    const messages:{
                        username:string,
                        pfp:string,
                        content:string,
                        content_type:string
                    }[] = [];

                    rows.forEach(row => 
                        messages.push({
                            username:     row.username,
                            pfp:          row.pfp,
                            content:      row.content,
                            content_type: row.content_type
                        })
                    );
                    resolve(messages)
                }
                
            )

        });
    }

    public static getMessageByChannelAndId(id_channel:Number, id_message:Number): Promise<Message> {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM ${MessageModel.table_name} WHERE id = ? AND id IN (
                    SELECT id_message FROM ${this.table_name} WHERE id_channel = ?
                )`,
                [id_message, id_channel],
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
                        reject(`${MessageModel.table_name} not found`)
                    }
                    
                }
            )
        });
        
    }
}
/*
SELECT 
    user.username,
    user.pfp,
    message.content,
    message.content_type,
    message.timestamp
FROM 
    message
INNER JOIN
    user
ON
    message.id_sender = user.id
WHERE
    message.id IN (
        SELECT id_message FROM linker_channel_messages WHERE id_channel = 12
    )
ORDER BY message.timestamp DESC
LIMIT 100
*/