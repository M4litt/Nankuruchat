import { RowDataPacket } from "mysql2";
import { db } from "../db";
import { Channel } from "../types/channel.type";
import { Message } from "../types/message.type";
import { MessageModel } from "./message.model";

const table_name = 'channel';

export class ChannelModel {
    
    public static getAll():Promise<Channel[]> {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM ${table_name}`,
                (err, res) => {
                    if (err) reject(err);
                    const rows = <RowDataPacket[]> res;
                    const channels:Channel[] = [];

                    rows.forEach(row => 
                        channels.push(new Channel(row.id, row.name))
                    );
                    resolve(channels)
                }
            )
        });
    }

    public static getOne(id:Number):Promise<Channel> {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM ${table_name} WHERE id = ?`,
                [id],
                (err, res) => {
                    if (err) reject(err);
                    const row  = (<RowDataPacket> res)[0];
                    try {
                        const channel = new Channel(row.id, row.name);
                        resolve(channel);
                    } catch(error) {
                        reject(`${table_name} not found`)
                    }
                }
            )
        });
    }

    public static create(channel:Channel):Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO ${table_name} (name) VALUES (?)`,
                [channel.name],
                (err, res) => {
                    if (err) reject(err);
                    resolve(true);
                }
            )
        });
    }

    public static update(id:Number, channel:Channel):Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.query(
                `UPDATE ${table_name} SET name = ? WHERE id = ?`,
                [channel.name, id],
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
                    
                    // delete messages
                    this.deleteAllMessages(id)
                    .then(data => {

                        // delete linkers channel -> server
                        this.deleteLinkers(id)
                        .then(data => resolve(true))
                        .catch(err => reject(err))
                    })
                    .catch(err => reject(err));
                }
            );
        });
    }
    
    // extras

    // get all messages from a channel
    public static getMessages(id:Number):Promise<Message[]> {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM message WHERE id IN (
                    SELECT id_message FROM linker_channel_messages WHERE id_channel = ?
                )`,
                [id],
                (err, res) => {
                    if (err) reject(err);
                    const rows = <RowDataPacket[]> res;
                    const messages:Message[] = [];

                    rows.forEach(row => 
                        messages.push(new Message(row.id, row.id_sender, row.content, row.content_type))
                    );
                    resolve(messages)
                }
            );
        });
    }

    // add message to channel
    public static addMessage(id_channel:Number, msg:Message): Promise<boolean> {
        return new Promise((resolve, reject) => {
            MessageModel.create(msg)
            .then(data => {
                // add linker (channel -> message)
                db.query(
                    `INSERT INTO linker_channel_messages (id_channel, id_message) VALUES (?, ?)`,
                    [id_channel, msg.id],
                    (err, res) => {
                        if (err) reject(err);
                        resolve(true);
                    }
                );
            })
            .catch(err => reject(err));
        });
    }

    // delete message from channel
    public static deleteMessage(id:Number):Promise<boolean> {
        return new Promise((resolve, reject) => {
            MessageModel.delete(id)
            .then(data => resolve(true))
            .catch(err => reject(err));
        });
    }

    // delete all messages
    private static deleteAllMessages(id:Number):Promise<boolean> {
        return new Promise((resolve, reject) => {

            this.getMessages(id)
            .then(
                messages => {
                    messages.forEach(message => {
                        MessageModel.delete(message.id)
                        .then(data => resolve(true))
                        .catch(err => reject(err));
                    });
                }
            )
            .catch(err => reject(err));
        });
    }

    // delete linkers (channel -> server)
    private static deleteLinkers(id:Number):Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.query(
                `DELETE * FROM linker_channel_server WHERE id_channel = ?`,
                [id],
                (err, res) => {
                    if (err) reject(err);
                    resolve(true); 
                }
            );
        })
    }


}