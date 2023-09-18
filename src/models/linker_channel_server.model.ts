import { resolve } from "path";
import { db } from "../db";

const table_name = "linker_channel_server";

export class LinkerChannelServerModel {
    
    public static create(id_channel: Number, id_server: Number): Promise<any> 
    {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO ${table_name} (id_channel, id_server) VALUES (?, ?)`,
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
                `DELETE FROM ${table_name} WHERE id_channel = ?`,
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
                `DELETE FROM ${table_name} WHERE id_server = ?`,
                [id_server],
                (err, res) => {
                    if (err) throw err;
                    resolve(res)
                }
            )
        })
    }
}