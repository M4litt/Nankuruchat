import { RowDataPacket } from "mysql2";
import { db } from "../db";
import { User } from "../types/user.type";

const table_name = 'user';

export class UserModel {

    public static getAll():Promise<User[]> {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM ${table_name}`,
                (err, res) => {
                    if (err) reject(err);
                    const rows = <RowDataPacket[]> res;
                    const users:User[] = [];

                    rows.forEach(row => 
                        users.push(new User(row.id, row.username, row.pfp, row.email, row.password))
                    );
                    resolve(users)
                }
            )
        });
    }

    public static getOne(id:Number):Promise<User> {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM ${table_name} WHERE id = ?`,
                [id],
                (err, res) => {
                    if (err) reject(err);
                    const row  = (<RowDataPacket> res)[0];
                    try {
                        const user = new User(row.id, row.username, row.pfp, row.email, row.password);
                        resolve(user);
                    } catch(error) {
                        reject(`${table_name} not found`)
                    }
                }
            )
        });
    }

    public static create(user:User):Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO ${table_name} (username, pfp, email, password) VALUES (?, ?, ?, ?)`,
                [user.username, user.pfp, user.email, user.password],
                (err, res) => {
                    if (err) reject(err);
                    resolve(true);
                }
            )
        });
    }

    public static update(id:Number, user:User):Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.query(
                `UPDATE ${table_name} SET username = ?, pfp = ?, email = ?, password = ? WHERE id = ?`,
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
            db.query(
                `DELETE FROM ${table_name} WHERE id = ?`,
                [id],
                (err, res) => {
                    if (err) reject(err)
                    resolve(true)
                }
            )
        });
    }
}
