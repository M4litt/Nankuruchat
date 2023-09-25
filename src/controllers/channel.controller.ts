import { Request, Response } from "express";
import { ChannelModel } from "../models/channel.model";
import { Message } from "../types/message.type";
import { MessageModel } from "../models/message.model";

export class ChannelController {
        
    public static getAll(req:Request, res:Response) {
        ChannelModel.getAll()
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({'message': err}))
    }

    public static getOne(req:Request, res:Response) {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({'message': 'id must be a number'});
            return;
        }

        ChannelModel.getOne(id)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({'message': err}))
    }

    public static create(req:Request, res:Response) {
        const channel = req.body;
        ChannelModel.create(channel)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({'message': err}))
    }

    public static update(req:Request, res:Response) {
        const channel = req.body;
        const id = Number(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({'message': 'id must be a number'});
            return;
        }

        ChannelModel.update(id, channel)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({'message': err}))
    }

    public static delete(req:Request, res:Response) {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({'message': 'id must be a number'});
            return;
        }

        ChannelModel.delete(id)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({'message': err}))
    }

    //extras

    public static getMessage(req:Request, res:Response) {
        const id_channel = Number(req.params.id);
        const id_message = Number(req.params.id_message);

        if (isNaN(id_channel) || isNaN(id_message)) {
            res.status(400).json({'message': 'id must be a number'});
            return;
        }

        ChannelModel.getMessage(id_channel, id_message)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({'message': err}))
    }

    public static getMessages(req:Request, res:Response) {
        
        const id = Number(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({'message': 'id must be a number'});
            return;
        }

        ChannelModel.getMessages(id)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({'message': err}))
    }

    public static addMessage(req:Request, res:Response) {
        
        const id = Number(req.params.id);
        const message:Message= req.body;

        if (isNaN(id)) {
            res.status(400).json({'message': 'id must be a number'});
            return;
        }

        ChannelModel.addMessage(id, message)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({'message': err}))
    }

    public static deleteMessage(req:Request, res:Response) {
        const id_message = Number(req.params.id_message);
        const id_channel = Number(req.params.id);

        if (isNaN(id_message)) {
            res.status(400).json({'message': 'id must be a number'});
            return;
        }

        ChannelModel.deleteMessage(id_channel, id_message)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({'message': err}))
    }

    public static updateMessage(req:Request, res:Response) {
        const id_channel = Number(req.params.id);
        const id_message = Number(req.params.id_message);
        const message:Message = req.body;

        if (isNaN(id_message)) {
            res.status(400).json({'message': 'id must be a number'});
            return;
        }

        ChannelModel.updateMessage(id_channel, id_message, message)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({'message': err}))
    }

}
