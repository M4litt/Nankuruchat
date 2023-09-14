import { db } from "../db";
import { RowDataPacket } from "mysql2";
import { Server } from "../types/server.type";
import { Message } from "../types/message.type";
import { Channel } from "../types/channel.type";

const table_name = 'server';

export class ServerModel {
    
    public static getAll():Promise<Server[]> {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM ${table_name}`,
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
                `SELECT * FROM ${table_name} WHERE id = ?`,
                [id],
                (err, res) => {
                    if (err) reject(err);
                    const row  = (<RowDataPacket> res)[0];
                    try {
                        const server = new Server(row.id, row.name, row.description, row.picture);
                        resolve(server);
                    } catch(error) {
                        reject(`${table_name} not found`)
                    }
                }
            )
        });
    }

    public static create(server:Server):Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO ${table_name} (name, description, picture) VALUES (?, ?, ?)`,
                [server.name, server.description, server.picture],
                (err, res) => {
                    if (err) reject(err);
                    resolve(true);
                }
            )
        });
    }

    public static update(id:Number, server:Server):Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.query(
                `UPDATE ${table_name} SET name = ?, description = ?, picture = ? WHERE id = ?`,
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
                `DELETE FROM ${table_name} WHERE id = ?`,
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
    public static addChannel(id_server:Number, id_channel:Number):Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO linker_channel_server (id_server, id_channel) VALUES (?, ?)`,
                [id_server, id_channel],
                (err, res) => {
                    if (err) reject(err);
                    resolve(true);
                }
            )
        });
    }

    // get channels from a server
    public static getChannels(id_server:Number):Promise<Channel[]> {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM linker_channel_server WHERE id_server = ?`,
                [id_server],
                (err, res) => {
                    if (err) reject(err);
                    const rows = <RowDataPacket[]> res;
                    const channel: Channel[] = [];

                    rows.forEach(row => 
                        channel.push(new Channel(row.id, row.name))
                    );
                    resolve(channel)
                }
            )
        });
    }

    // delete channels
    public static deleteChannel(id_server:Number, id_channel:Number):Promise<boolean> {
        return new Promise((resolve, reject) => {
            
        });
    }

}