import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

const SECRET_KEY = fs.readFile(process.env.JWT_SECRET!, 'utf-8', (err, data) => { data })! || 'invalid-secret';

export async function auth(req:Request, res:Response, next:NextFunction)
{
    const token = req.headers['authorization'];

    try 
    {
        if (!token) throw new Error('No token provided');

        const decoded = jwt.verify(token, SECRET_KEY);

        next();
    }
    catch (err:any)
    {
        res.status(401).json({ message: err.message });
    }
}