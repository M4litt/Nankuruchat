import { RowDataPacket } from "mysql2";
import { db } from "../db";
import { User } from "../types/user.type";
import { UserModel } from "./user.model";

export class EnemiesModel 
{
    public static table:string = 'enemies';

    public static addEnemy(id:number, enemy_id:number): Promise<any>
    {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO ${this.table} (id_user, id_enemy) VALUES (?, ?)`,
                [id, enemy_id],
                (err, res) => {
                    if (err) reject(err);
                    resolve(res);
                }
            );
        })
    }

    public static removeEnemy(id:number, enemy_id:number): Promise<any>
    {
        return new Promise((resolve, reject) => {
            db.query(
                `DELETE FROM ${this.table} WHERE id_user = ? AND id_enemy = ?`,
                [id, enemy_id],
                (err, res) => {
                    if (err) reject(err);
                    resolve(res);
                }
            );
        })
    }

    public static getEnemies(id:number): Promise<User[]>
    {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM ${UserModel.table_name} WHERE id IN (
                    SELECT id_enemy FROM ${this.table} WHERE id_user = ?
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
            )
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
        })
    }

    public static deleteByEnemy(id_enemy:number): Promise<any> {
        return new Promise((resolve, reject) => {
            db.query(
                `DELETE FROM ${this.table} WHERE id_enemy = ?`,
                [id_enemy],
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
                `DELETE FROM ${this.table} WHERE id_user = ? OR id_enemy = ?`,
                [id, id],
                (err, res) => {
                    if (err) reject(err);
                    resolve(res);
                }
            );
        })
    }
}