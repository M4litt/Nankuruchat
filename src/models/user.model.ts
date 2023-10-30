import { RowDataPacket } from "mysql2";
import { db } from "../db";
import { User } from "../types/user.type";
import { BlockedModel } from "./blocked.model";
import { FriendsModel } from "./friends.model";
import { EnemiesModel } from "./enemies.model";

export class UserModel {

    public static table_name = 'user';

    public static getAll():Promise<User[]> {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM ${this.table_name}`,
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

    public static getOne(id:Number):Promise<User | null> {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM ${this.table_name} WHERE id = ?`,
                [id],
                (err, res) => {
                    if (err) reject(err);
                    const row  = (<RowDataPacket> res)[0];
                    try {
                        const user = new User
                        (
                            row.id, 
                            row.username, 
                            row.pfp, 
                            row.email, 
                            row.password, 
                            row.description
                        );
                        resolve(user);
                    } catch(error) {
                        reject(`${this.table_name} not found`)
                    }
                }
            )
        });
    }

    public static create(user:User):Promise<any> {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO ${this.table_name} (username, pfp, email, password, description) VALUES (?, ?, ?, ?, ?)`,
                [user.username, user.pfp, user.email, user.password, user.description],
                (err, res) => {
                    if (err) reject(err);
                    resolve(res);
                }
            )
        });
    }

    public static update(id:Number, user:User):Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.query(
                `UPDATE ${this.table_name} SET username = ?, pfp = ?, email = ?, password = ? WHERE id = ?`,
                [user.username, user.pfp, user.email, user.password, id],
                (err, res) => {
                    if (err) reject(err)
                    resolve(true)
                }
            )
        })
    }

    public static delete(id:Number):Promise<boolean> {
        return new Promise((resolve, reject) => {
            UserModel.deleteLinkers(id)
            .then(() => {
                db.query(
                    `DELETE FROM ${this.table_name} WHERE id = ?`,
                    [id],
                    (err, res) => {
                        if (err) reject(err)
                        resolve(true)
                    }
                )
            })
            .catch(err => reject(err))
        });
    }

    public static getByEmail(email:string | String):Promise<User | null> {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM ${this.table_name} WHERE email = ?`,
                [email],
                (err, res) => {
                    if (err) reject(err);
                    const row  = (<RowDataPacket> res)[0];
                    try {
                        const user = new User
                        (
                            row.id, 
                            row.username, 
                            row.pfp, 
                            row.email, 
                            row.password, 
                            row.description
                        );
                        resolve(user);
                    } catch(error) {
                        resolve(null)
                    }
                }
            )
        });
    }

    private static deleteLinkers(id:Number):Promise <any> 
    {
        return new Promise(async(resolve, reject) => {
            BlockedModel.delete(id)
            .then(() => {
                FriendsModel.delete(id)
                .then(() => {
                    EnemiesModel.delete(id)
                    .then(() => resolve(true))
                    .catch(err => reject(err))
                })
                .catch(err => reject(err))
            })
            .catch(err => reject(err))
        });
    }
}
