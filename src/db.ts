import dotenv from 'dotenv'
import mysql from 'mysql2'

dotenv.config()

export const db = mysql.createConnection(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PWD,
        database: process.env.DB_NAME,
    }
);

export function init() {
    db.query("SHOW TABLES");    // test query
    
    //console.log(`Succesfully connected to MySQL`)
    //console.log(`User: '${process.env.DB_USER}'@'${process.env.DB_HOST}`)
}