import { RowDataPacket } from "mysql2";
import { db } from "../db";
import { User } from "../types/user.type";
import { UserModel } from "./user.model";
import { ServerModel } from "./server.model";
import { Server } from "../types/server.type";

export class LinkerUsersServerModel {

    public static table_name = "linker_users_server";
    
    public static create(id_user:Number, id_server:Number): Promise<any> 
    {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO ${this.table_name} (id_user, id_server) VALUES (?, ?)`,
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
                `DELETE FROM ${this.table_name} WHERE id_user = ?`,
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
                `DELETE FROM ${this.table_name} WHERE id_server = ?`,
                [id_server],
                (err, res) => {
                    if (err) reject(err);
                    resolve(res);
                }
            )
        });
    }

    public static getUsersByServer(id_server:Number): Promise<User[]>
    {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM ${UserModel.table_name} WHERE id IN (SELECT id_user FROM ${this.table_name} WHERE id_server = ?)`,
                [id_server],
                (err, res) => {
                    if (err) reject(err);
                    const rows = <RowDataPacket[]> res;
                    const users:User[] = [];

                    rows.forEach(row => 
                        users.push(new User(row.id, row.username, row.pfp, row.email, row.password, row.description))
                    );
                    resolve(users)
                }
            )
        });
    }

    public static getUserByServerAndId(id_server:Number, id_user:Number): Promise<User>
    {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM ${UserModel.table_name} WHERE id = ? AND id IN (SELECT id_user FROM ${this.table_name} WHERE id_server = ?)`,
                [id_user, id_server],
                (err, res) => {
                    if (err) reject(err);
                    const row  = (<RowDataPacket> res)[0];
                    try {
                        const user = new User(row.id, row.username, row.pfp, row.email, row.password, row.description);
                        resolve(user);
                    } catch(error) {
                        reject(`${this.table_name} not found`)
                    }
                }
            )
        });
    }

    public static addUserToServer(id_user:Number, id_server:Number): Promise<any>
    {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO ${this.table_name} (id_user, id_server) VALUES (?, ?)`,
                [id_user, id_server],
                (err, res) => {
                    if (err) reject(err);
                    resolve(res);
                }
            )
        })
    }

    public static removeUser(id_user:Number, id_server:Number): Promise<User>
    {
        return new Promise((resolve, reject) => {
            db.query(
                `DELETE FROM ${this.table_name} WHERE id_user = ? AND id_server = ?`,
                [id_user, id_server],
                (err, res) => {
                    if (err) reject(err);
                    try {
                        const row = (<RowDataPacket> res)[0];
                        const user = new User(row.id, row.username, row.pfp, row.email, row.password, row.description);
                        resolve(user);
                    } catch(error) {
                        reject(`${this.table_name} not found`)
                    }
                }
            )
        });
    }

    public static getServersByUser(id_user:Number): Promise<any>
    {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM ${ServerModel.table_name} WHERE id IN (
                    SELECT id_server FROM ${this.table_name} WHERE id_user = ?
                )`,
                [id_user],
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
        })
    }
}