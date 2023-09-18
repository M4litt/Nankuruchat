import { Request, Response } from "express";
import { ServerModel } from "../models/server.model";
import { Channel } from "../types/channel.type";

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
    
    public static addChannel(req: Request, res:Response) {
        const id_server = Number(req.params.id_server);
        const channel:Channel = req.body;

        if (isNaN(id_server)) {
            res.status(400).json({'message': 'id_server must be a number'});
            return;
        }

        ServerModel.addChannel(id_server, channel)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({'message': err}))
    }

    public static getChannels(req: Request, res:Response) {
        const id_server = Number(req.params.id_server);

        if (isNaN(id_server)) {
            res.status(400).json({'message': 'id_server must be a number'});
            return;
        }

        ServerModel.getChannels(id_server)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({'message': err}))
    }

    public static getChannel(req: Request, res:Response) {
        const id_server = Number(req.params.id_server);
        const id_channel = Number(req.params.id_channel);

        if (isNaN(id_server) || isNaN(id_channel)) {
            res.status(400).json({'message': 'id must be a number'});
            return;
        }

        ServerModel.getChannel(id_server, id_channel)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({'message': err}))
    }

    public static updateChannel(req:Request, res:Response) {
        const id_server = Number(req.params.id_server);
        const id_channel = Number(req.params.id_channel);
        const channel:Channel = req.body;

        if (isNaN(id_server) || isNaN(id_channel)) {
            res.status(400).json({'message': 'id must be a number'});
            return;
        }

    }

    public static getMessages(req: Request, res: Response) {
        const id_server = Number(req.params.id_server);
        const id_channel = Number(req.params.id_channel);

        if (isNaN(id_server) || isNaN(id_channel)) {
            res.status(400).json({'message': 'id must be a number'});
            return;
        }

        ServerModel.getMessagesFromChannel(id_server, id_channel)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({'message': err}))
    }

    public static addMessage(req:Request, res:Response) {
        const id_channel = Number(req.params.id_channel);
        const id_server = Number(req.params.id_server);
        const message = req.body;

        if (isNaN(id_server) || isNaN(id_channel)) {
            res.status(400).json({'message': 'id must be a number'});
            return;
        }

        ServerModel.addMessageToChannel(id_server, id_channel, message)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({'message': err}))
    }
}