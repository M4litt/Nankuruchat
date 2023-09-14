import { Request, Response } from "express";
import { ServerModel } from "../models/server.model";

export class ServerController {
    public static getAll(req:Request, res:Response) {
        ServerModel.getAll()
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({'message': err}))
    }

    public static getOne(req:Request, res:Response) {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({'message': 'id must be a number'});
            return;
        }

        ServerModel.getOne(id)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({'message': err}))
    }

    public static create(req:Request, res:Response) {
        const server = req.body;
        ServerModel.create(server)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({'message': err}))
    }

    public static update(req:Request, res:Response) {
        const server = req.body;
        const id = Number(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({'message': 'id must be a number'});
            return;
        }

        ServerModel.update(id, server)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({'message': err}))
    }

    public static delete(req:Request, res:Response) {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({'message': 'id must be a number'});
            return;
        }

        ServerModel.delete(id)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({'message': err}))
    }
    
}