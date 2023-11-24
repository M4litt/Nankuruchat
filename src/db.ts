import dotenv from 'dotenv'
import mysql from 'mysql2'
import fs from 'fs'

dotenv.config()

const DB_PW = fs.readFileSync('/run/secrets/db_password', 'utf-8')

console.log(DB_PW)
console.log(process.env.DB_PWF)

export const db = mysql.createConnection(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: DB_PW!,
        database: process.env.DB_NAME,
    }
);

export function init() {
    // test query
    db.query(
        "SHOW TABLES",
        (err, res) => {
            if (err) throw err;
            //console.log(res);
        }
    );    // test query
    
    //console.log(`Succesfully connected to MySQL`)
    //console.log(`User: '${process.env.DB_USER}'@'${process.env.DB_HOST}`)
}