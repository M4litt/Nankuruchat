import { db } from "../db";

const table_name = "linker_users_server";

export class LinkerUsersServerModel {
    
    public static create(id_user:Number, id_server:Number): Promise<any> 
    {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO ${table_name} (id_user, id_server) VALUES (?, ?)`,
                [id_user, id_server],
                (err, res) => {
                    if (err) reject(err);
                    resolve(res);
                }
            )
        });
    }

    public static deleteByUser(id_user:Number): Promise<any> 
    {
        return new Promise((resolve, reject) => {
            db.query(
                `DELETE FROM ${table_name} WHERE id_user = ?`,
                [id_user],
                (err, res) => {
                    if (err) reject(err);
                    resolve(res);
                }
            )
        });
    }

    public static deleteByServer(id_server:Number): Promise<any>
    {
        return new Promise((resolve, reject) => {
            db.query(
                `DELETE FROM ${table_name} WHERE id_server = ?`,
                [id_server],
                (err, res) => {
                    if (err) reject(err);
                    resolve(res);
                }
            )
        });
    }
}