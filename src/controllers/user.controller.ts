import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { User } from "../types/user.type";

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
    
}