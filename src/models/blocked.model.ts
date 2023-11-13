import { RowDataPacket } from "mysql2";
import { db } from "../db";
import { UserModel } from "./user.model";
import { User } from "../types/user.type";

export class BlockedModel
{
    public static table:string = 'blocked';

    public static blockUser(id:number, blocked_id:number): Promise<any>
    {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO ${this.table} (id_user, id_blocked) VALUES (?, ?)`,
                [id, blocked_id],
                (err, res) => {
                    if (err) reject(err);
                    resolve(res);
                }
            );
            });
    }

    public static unblockUser(id:number, blocked_id:number): Promise<any>
    {
        return new Promise((resolve, reject) => {
            db.query(
                `DELETE FROM ${this.table} WHERE id_user = ? AND id_blocked = ?`,
                [id, blocked_id],
                (err, res) => {
                    if (err) reject(err);
                    resolve(res);
                }
            );
        });
    }

    public static getBlockedUsers(id:number): Promise<User[]> 
    {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM ${UserModel.table_name} WHERE id IN (
                    SELECT id_blocked FROM ${this.table} WHERE id_user = ?
                )`,
                [id],
                (err, res) => {
                    if (err) reject(err);
                    const rows = <RowDataPacket[]> res;
                    const users:User[] = [];

                    rows.forEach(row => 
                        users.push(new User(row.id, row.username, row.pfp, row.email, row.password, row.description))
                    );
                    resolve(users)
                }
            );
        })
    }
    /*
    public static deleteByUser(id_user:Number): Promise<any> 
    {
        return new Promise((resolve, reject) => {
            db.query(
                `DELETE FROM ${this.table} WHERE id_user = ?`,
                [id_user],
                (err, res) => {
                    if (err) reject(err);
                    resolve(res);
                }
            );
        });
    }

    public static deleteByBlocked(id_blocked:number): Promise<any> 
    {
        return new Promise((resolve, reject) => {
            db.query(
                `DELETE FROM ${this.table} WHERE id_blocked = ?`,
                [id_blocked],
                (err, res) => {
                    if (err) reject(err);
                    resolve(res);
                }
            );
        })
    }
    */
    public static delete(id:Number):Promise<any> 
    {
        return new Promise((resolve, reject) => {
            db.query(
                `DELETE FROM ${this.table} WHERE id_blocked = ? OR id_user = ?`,
                [id, id],
                (err, res) => {
                    if (err) reject(err);
                    resolve(res);
                }
            );
        });
    }
}