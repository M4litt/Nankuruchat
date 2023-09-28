import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { User } from "../types/user.type";
import { createHash } from "node:crypto";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export class UserController {

    public static getAll(req:Request, res:Response) {
        UserModel.getAll()
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({'message': err}))
    }
    
    public static create(req:Request, res:Response) {
        const user:User = req.body;
        UserModel.create(user)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({'message': err}))
    }

    public static getOne(req:Request, res:Response) {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({'message': 'id must be a number'});
            return;
        }

        UserModel.getOne(id)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({'message': err}))
    }

    public static update(req:Request, res:Response) {
        const user:User = req.body;
        const id = Number(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({'message': 'id must be a number'});
            return;
        }

        UserModel.update(id, user)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({'message': err}))
    }

    public static delete(req:Request, res:Response) {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({'message': 'id must be a number'});
            return;
        }

        UserModel.delete(id)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({'message': err}))
    }

    public static register(req:Request, res:Response) 
    {
        // grab user data
        const user:User = req.body;

        // validate email
        const mail = user.email.toString().trim();
        if (!UserController.isMailValid(mail)) {
            res.status(400).json({'message': 'invalid email'});
            return;
        }

        // validate password
        const pass = user.password.toString().trim();
        if (!UserController.isPasswordValid(pass)) {
            res.status(400).json({'message': 'invalid password'});
            return;
        }

        // check if email is already taken
        UserModel.getByEmail(mail)
        .then(data => {

            // if already exists
            if (data) {
                res.status(400).json({'message': 'email already taken'});
                return;
            }

            // hash password
            user.password = UserController.sha256(pass);
            
            // create user  
            UserModel.create(user)
            .then(data => res.status(200).json(data))
            .catch(err => res.status(400).json({'message': err}))
        })
        .catch(err => res.status(400).json({'message': err}))
    }

    public static login(req:Request, res:Response) 
    {
        const user:User = req.body;
        UserModel.getByEmail(user.email)
        .then(data => {

            // if user doens't exist
            if (!data) {
                res.status(400).json({'message': 'user not found'});
                return;
            }
            
            // check that passwords match
            if (data.password != UserController.sha256(user.password.toString().trim())) {
                res.status(400).json({'message': 'invalid password'});
                return;
            }

            res.status(200).json(UserController.getToken(user))
        })
        .catch(err => res.status(400).json({'message': err}))
    }
    
    private static isPasswordValid(password:string) 
    {
        return true;
        /*
        RegEx: 
        - minimum length requirement 
        - contains one upper case letter
        - contains one lower case letter
        - contains one number
        - contains one special character
         */
        const expression:RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return expression.test(password);
    }

    private static isMailValid(mail:string):boolean 
    {
        const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return expression.test(mail);
    }

    private static sha256(data:string)
    {
        return createHash('sha256').update(data).digest('hex');
    }

    private static getToken(user:User)
    {
        return jwt.sign(
            user,
            process.env.JWT_SECRET || 'invalid-secret',
            {
                expiresIn: '1h'
            }
        )
    }
    
}