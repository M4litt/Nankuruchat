import { RowDataPacket } from "mysql2";
import { db } from "../db";
import { User } from "../types/user.type";
import { UserModel } from "./user.model";

export class FriendsModel
{
    public static table:string = 'friends';

    public static addFriend(id:number, friend_id:number): Promise<any>
    {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO ${this.table} (id_user, id_friend) VALUES (?, ?)`,
                [id, friend_id],
                (err, res) => {
                    if (err) reject(err);
                    resolve(res);
                }
            );
        });
    }

    public static removeFriend(id:number, friend_id:number): Promise<any>
    {
        return new Promise((resolve, reject) => {
            db.query(
                `DELETE FROM ${this.table} WHERE id_user = ? AND id_friend = ?`,
                [id, friend_id],
                (err, res) => {
                    if (err) reject(err);
                    resolve(res);
                }
            );
        });
    }

    public static getFriends(id:number): Promise<User[]>
    {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM ${UserModel.table_name} WHERE id IN (
                    SELECT id_friend FROM ${this.table} WHERE id_user = ?
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
        });
    }
    /*
    public static deleteByUser(id_user:number): Promise<any> {
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

    public static deleteByFriend(id_friend:number): Promise<any> {
        return new Promise((resolve, reject) => {
            db.query(
                `DELETE FROM ${this.table} WHERE id_friend = ?`,
                [id_friend],
                (err, res) => {
                    if (err) reject(err);
                    resolve(res);
                }
            );
        });
    }
    */

    public static delete(id:Number):Promise<any>
    {
        return new Promise((resolve, reject) => {
            db.query(
                `DELETE FROM ${this.table} WHERE id_user = ? OR id_friend = ?`,
                [id, id],
                (err, res) => {
                    if (err) reject(err);
                    resolve(res);
                }
            );
        });
    }
}