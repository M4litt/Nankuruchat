import { RowDataPacket } from "mysql2";
import { db } from "../db";
import { Channel } from "../types/channel.type";
import { Message } from "../types/message.type";
import { MessageModel } from "./message.model";
import { LinkerChannelMessagesModel } from "./linker_channel_messages.model";
import { LinkerChannelServerModel }   from "./linker_channel_server.model";


export class ChannelModel {

    public static table_name = 'channel'
    
    public static getAll():Promise<Channel[]> {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM ${this.table_name}`,
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
                `SELECT * FROM ${this.table_name} WHERE id = ?`,
                [id],
                (err, res) => {
                    if (err) reject(err);
                    const row  = (<RowDataPacket> res)[0];
                    try {
                        const channel = new Channel(row.id, row.name);
                        resolve(channel);
                    } catch(error) {
                        reject(`${this.table_name} not found`)
                    }
                }
            )
        });
    }

    public static create(channel:Channel):Promise<any> {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO ${this.table_name} (name) VALUES (?)`,
                [channel.name],
                (err, res) => {
                    if (err) reject(err);
                    resolve(res);
                }
            )
        });
    }

    public static update(id:Number, channel:Channel):Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.query(
                `UPDATE ${this.table_name} SET name = ? WHERE id = ?`,
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
                `DELETE FROM ${this.table_name} WHERE id = ?`,
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

    // get one message from channel
    public static getMessage(id_channel:Number, id_message:Number):Promise<Message> 
    {   
        return new Promise((resolve, reject) => {
            
            ChannelModel.getOne(id_channel)
            .then(data => {
                
                if (data == null) reject(`${this.table_name} not found`);

                LinkerChannelMessagesModel.getMessageByChannelAndId(id_channel, id_message)
                .then(data => resolve(data))
                .catch(err => reject(err));
            })
            .catch(err => reject(err));
        })
    }

    // get all messages from a channel
    public static getMessages(id_channel:Number):Promise<Message[]> 
    {
        return new Promise((resolve, reject) => {
            
            // find if channel exists
            ChannelModel.getOne(id_channel)
            .then(data => {
                
                // if not exist
                if (data == null) reject(`${this.table_name} not found`);

                // get all messages from channel
                LinkerChannelMessagesModel.getMessagesByChannel(id_channel)
                .then(data => resolve(data))
                .catch(err => reject(err));
            })
            .catch(err => reject(err));
        })
    }

    // add message to channel
    public static addMessage(id_channel:Number, msg:Message): Promise<boolean> {
        return new Promise((resolve, reject) => {
            
            // create message
            MessageModel.create(msg)
            .then(data => {              
                
                // insert channel id and new message id
                LinkerChannelMessagesModel.create(id_channel, data.insertId)
                .then(data => resolve(true))
                .catch(err => reject(err));
            })
            .catch(err => reject(err));
        });
    }

    // delete message from channel
    public static deleteMessage(id_channel:Number, id_message:Number):Promise<boolean> {
        return new Promise((resolve, reject) => {
            LinkerChannelMessagesModel.getMessageByChannelAndId(id_channel, id_message)
            .then(data => {
                if (!data) reject('message not found');
                // delete message
                MessageModel.delete(id_message)
                .then(data => resolve(true))
                .catch(err => reject(err));
            })
          
        });
    }

    // delete all messages
    private static deleteAllMessages(id_channel:Number):Promise<any> {
        return new Promise((resolve, reject) => {
            
            // get all messages from channel
            ChannelModel.getMessages(id_channel)
            .then(messages => {

                // iterate over all messages
                messages.forEach(message => {

                    // delete message by id
                    MessageModel.delete(message.id)
                    .then(data => resolve(data))
                    .catch(err => reject(err));
                });
            })
            .catch(err => reject(err));
        });
    }

    // delete linkers (channel -> server)
    private static deleteLinkers(id_channel:Number):Promise<boolean> {
        return LinkerChannelServerModel.deleteByChannel(id_channel);
    }

    // update message from channel
    public static updateMessage(id_channel:Number, id_message:Number, message:Message):Promise<any> {
        return new Promise((resolve, reject) => {
            
            // check if message exists inside channel
            ChannelModel.getMessage(id_channel, id_message)
            .then(data => {

                // update message
                MessageModel.update(id_message, message)
                .then(data => resolve(true))
                .catch(err => reject(err));
            })
            .catch(err => reject(err));
        });
    }

}