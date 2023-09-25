import { db } from "../db";
import { Channel } from "../types/channel.type";
import { ChannelModel } from "./channel.model";
import { RowDataPacket } from "mysql2";


export class LinkerChannelServerModel {

    public static table_name = "linker_channel_server";
    
    public static create(id_channel: Number, id_server: Number): Promise<any> 
    {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO ${this.table_name} (id_channel, id_server) VALUES (?, ?)`,
                [id_channel, id_server],
                (err, res) => {
                    if (err) reject(err);
                    resolve(res);
                }
            )
        });
    }

    public static deleteByChannel(id_channel: Number): Promise<any> 
    {   
        return new Promise((resolve, reject) => {
            db.query(
                `DELETE FROM ${this.table_name} WHERE id_channel = ?`,
                [id_channel],
                (err, res) => {
                    if (err) throw err;
                    resolve(res)
                }
            )
        });
    }

    public static deleteByServer(id_server: Number): Promise<any> 
    {
        return new Promise((resolve, reject) => {
            db.query(
                `DELETE FROM ${this.table_name} WHERE id_server = ?`,
                [id_server],
                (err, res) => {
                    if (err) throw err;
                    resolve(res)
                }
            )
        })
    }
    
    public static getChannel(id_server:Number, id_channel:Number): Promise<any> {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM channel WHERE id = ? AND id IN (
                    SELECT id_channel FROM linker_channel_server WHERE id_server = ?
                )`,
                [id_channel, id_server],
                (err, res) => {
                    if (err) reject(err);
                    const row  = (<RowDataPacket> res)[0];
                    try {
                        const channel = new Channel(row.id, row.name);
                        resolve(channel);
                    } catch(error) {
                        reject(`channel not found`)
                    }
                }
            );
        })
    }

    // extras

    public static getChannelsByServer(id_server: Number): Promise<Channel[]> {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM ${ChannelModel.table_name} WHERE id IN (
                    SELECT id_channel FROM ${this.table_name} WHERE id_server = ?
                )`,
                [id_server],
                (err, res) => {
                    if (err) reject(err);
                    const rows = <RowDataPacket[]> res;
                    const channels:Channel[] = [];

                    rows.forEach(row => 
                        channels.push(new Channel(row.id, row.name))
                    );
                    resolve(channels);
                }
            );
        });
    }

    public static getChannelByServerAndId(id_channel:Number, id_server:Number): Promise<Channel> 
    {
        
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM channel WHERE id = ? AND id IN (
                    SELECT id_channel FROM linker_channel_server WHERE id_server = ?
                )`,
                [id_channel, id_server],
                (err, res) => {

                    if (err) reject(err);

                    const row  = (<RowDataPacket> res)[0];
                    
                    try 
                    {   
                        const channel = new Channel(
                            row.id, 
                            row.name
                        );
                        
                        resolve(channel);
                    } 
                    catch(error) 
                    {
                        reject(`channel not found`)
                    }
                }
            )
        });
    }

    public static deleteChannel(id_server:Number, id_channel:Number): Promise<any> 
    {
        return new Promise((resolve, reject) => {

            db.query(
                `SELECT * FROM ${this.table_name} WHERE id_server = ? AND id_channel = ?`,
                [id_server, id_channel],
                (err, res) => {

                    if (err) reject(err);
                }
            )


            ChannelModel.delete(id_channel)
            .then(() => {})
            .catch((err) => reject(err))
        });
    }
    
}