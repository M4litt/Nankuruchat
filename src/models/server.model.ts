import { db } from "../db";
import { RowDataPacket } from "mysql2";
import { Server } from "../types/server.type";
import { Message } from "../types/message.type";
import { Channel } from "../types/channel.type";
import { LinkerChannelServerModel } from "./linker_channel_server.model";
import { ChannelModel } from "./channel.model";


export class ServerModel {

    public static table_name = 'server';
    
    public static getAll():Promise<Server[]> {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM ${this.table_name}`,
                (err, res) => {
                    if (err) reject(err);
                    const rows = <RowDataPacket[]> res;
                    const servers: Server[] = [];

                    rows.forEach(row => 
                        servers.push(new Server(row.id, row.name, row.description, row.picture))
                    );
                    resolve(servers)
                }
            )
        });
    }

    public static getOne(id:Number):Promise<Server> {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM ${this.table_name} WHERE id = ?`,
                [id],
                (err, res) => {
                    if (err) reject(err);
                    const row  = (<RowDataPacket> res)[0];
                    try {
                        const server = new Server(row.id, row.name, row.description, row.picture);
                        resolve(server);
                    } catch(error) {
                        reject(`${this.table_name} not found`)
                    }
                }
            )
        });
    }

    public static create(server:Server):Promise<any> {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO ${this.table_name} (name, description, picture) VALUES (?, ?, ?)`,
                [server.name, server.description, server.picture],
                (err, res) => {
                    if (err) reject(err);
                    resolve(res);
                }
            )
        });
    }

    public static update(id:Number, server:Server):Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.query(
                `UPDATE ${this.table_name} SET name = ?, description = ?, picture = ? WHERE id = ?`,
                [server.name, server.description, server.picture, id],
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
                    resolve(true);
                }
            )
        });
    }
    
    // extra

    // add channel to server
    public static addChannel(id_server:Number, channel:Channel):Promise<any> {
        return new Promise((resolve, reject) => {
            ChannelModel.create(channel)
            .then(data => {
                LinkerChannelServerModel.create(data.insertId, id_server)
                .then(data => resolve(data))
                .catch(err => reject(err))
            })   
            .catch(err => reject(err))
         
        });
    }

    // get channels from a server
    public static getChannels(id_server:Number):Promise<Channel[]> {
        return new Promise((resolve, reject) => {

            ServerModel.getOne(id_server)
            .then(data => {

                if (data == null) reject('server not found');

                LinkerChannelServerModel.getChannelsByServer(id_server)
                .then(data => resolve(data))
                .catch(err => reject(err))
            })
            .catch(err => reject(err))


        });
    }

    public static getChannel(id_server:Number, id_channel:Number):Promise<Channel> {
        return new Promise((resolve, reject) => {
            
            // check if server exists
            ServerModel.getOne(id_server)
            .then(data => {

                if (data == null) reject('server not found');

                LinkerChannelServerModel.getChannelByServerAndId(id_channel, id_server)
                .then(data => resolve(data))
                .catch(err => reject(err))
            })
            .catch(err => reject(err))
        })
    }

    public static deleteChannel(id_server:Number, id_channel:Number):Promise<any>
    {
        return new Promise((resolve, reject) => {
            LinkerChannelServerModel.getChannelByServerAndId(id_channel, id_server)
            .then(channel => {
                
                if (!channel) reject('channel not found aaa');

                ChannelModel.delete(id_channel)
                .then(data => resolve(data))
                .catch(err => reject(err))
            })
            .catch(err => reject(err))
        });
    }

    public static updateChannel(id_server:Number, id_channel:Number, channel:Channel):Promise<boolean> {
        return new Promise((resolve, reject) => {
            ChannelModel.update(id_channel, channel)
            .then(data => resolve(data))
            .catch(err => reject(err)) 
        });
    }

    public static getMessagesFromChannel(id_server:Number, id_channel:Number):Promise<Message[]> {
        return new Promise((resolve, reject) => {

            // check server exists
            LinkerChannelServerModel.getChannelByServerAndId(id_channel, id_server)
            .then(channel => {

                if (channel == null) reject('channel not found');

                ChannelModel.getMessages(id_channel)
                .then(data => resolve(data))
                .catch(err => reject(err))
            })
            .catch(err => reject(err))
        });
    }

    public static addMessageToChannel(id_server:Number, id_channel:Number, message:Message):Promise<any> 
    {
        return new Promise((resolve, reject) => {

            LinkerChannelServerModel.getChannel(id_server, id_channel)
            .then(channel => {
                if (channel == null) reject('channel not found');

                ChannelModel.addMessage(id_channel, message)
                .then(data => resolve(data))
                .catch(err => reject(err))
            })
            .catch(err => reject(err))

        });
    }

    public static getMessageFromChannelById(id_server:Number, id_channel:Number, id_message:Number):Promise<any>
    {
        return new Promise((resolve, reject) => {
            this.getChannel(id_server, id_channel)
            .then(channel => {
                if (!channel) reject('channel not found');

                ChannelModel.getMessage(id_channel, id_message)
                .then(data => resolve(data))
                .catch(err => reject(err))
            })
            .catch(err => reject(err))
        })
    }

    public static deleteMessageFromChannel(id_server:Number, id_channel:Number, id_message:Number):Promise<any> 
    {
        return new Promise((resolve, reject) => {
            this.getChannel(id_server, id_channel)
            .then(channel => {
                if (!channel) reject('channel not found');

                ChannelModel.deleteMessage(id_channel, id_message)
                .then(data => resolve(data))
                .catch(err => reject(err))
            })
            .catch(err => reject(err))
        })
    }

    public static updateMessageFromChannel(id_server:Number, id_channel:Number, id_message:Number, message:Message): Promise<any> 
    {
        return new Promise((resolve, reject) => {
            ChannelModel.updateMessage(id_channel, id_message, message)
            .then(data => resolve(data))
            .catch(err => reject(err))
        });
    }

}