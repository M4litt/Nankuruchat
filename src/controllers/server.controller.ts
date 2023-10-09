import { Request, Response } from "express";
import { ServerModel } from "../models/server.model";
import { Channel } from "../types/channel.type";
import { LinkerUsersServerModel } from "../models/linker_users_server.model";
import { UserModel } from "../models/user.model";
import { User } from "../types/user.type";

interface ServerJson 
{
    id:          Number;
    name:        String;
    description: String;
    channels:    Channel[];
    users:       User[];
}

export class ServerController {
    public static async getAll(req:Request, res:Response) {

        let promises:Promise<ServerJson>[] = [];

        await ServerModel.getAll()
        .then(async(servers) => {

            servers.forEach(server => 
                promises.push(
                    new Promise<ServerJson>((resolve, reject) => {

                        let serverJson:ServerJson = {
                            id: server.id,
                            name: server.name,
                            description: server.description,
                            channels: [],
                            users: []
                        };

                        ServerModel.getChannels(server.id)
                        .then(channels => {
                            serverJson.channels = channels

                            LinkerUsersServerModel.getUsersByServer(server.id)
                            .then(users => {
                                serverJson.users = users
                                resolve(serverJson);
                            })
                            .catch(err => reject(err))
                        })
                        .catch(err => reject(err))
                    })
                )
            );

            const serversJson = await Promise.all(promises);

            res.status(200).json(serversJson);
        })
        .catch(err => res.status(400).json({'message': err}))
    }

    public static getOne(req:Request, res:Response) {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({'message': 'id must be a number'});
            return;
        }

        ServerModel.getOne(id)
        .then(server => {

            if (!server) {
                res.status(404).json({'message': 'server not found'});
                return;
            }

            let serverJson:ServerJson = {
                id: server.id,
                name: server.name,
                description: server.description,
                channels: [],
                users: []
            }

            ServerModel.getChannels(id)
            .then(channels => {
                serverJson.channels = channels
                LinkerUsersServerModel.getUsersByServer(id)
                .then(users => {
                    serverJson.users = users
                    res.status(200).json(serverJson)
                })
                .catch(err => res.status(400).json({'message': err}))
            })
            .catch(err => res.status(400).json({'message': err}))
        })
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
    
    // channels

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

        ServerModel.getOne(id_server)
        .then(data => {

            if (!data) {
                res.status(404).json({'message': 'server not found'});
                return;
            }

            ServerModel.updateChannel(id_server, id_channel, channel)
            .then(data => res.status(200).json(data))
            .catch(err => res.status(400).json({'message': err}))
        })
        .catch(err => res.status(400).json({'message': err}))
    }

    public static deleteChannel(req:Request, res:Response) {
        const id_server = Number(req.params.id_server);
        const id_channel = Number(req.params.id_channel);

        if (isNaN(id_server) || isNaN(id_channel)) {
            res.status(400).json({'message': 'id must be a number'});
            return;
        }
        
        ServerModel.deleteChannel(id_server, id_channel)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({'message': err}))
    }

    // messages

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

    public static getMessageById(req:Request, res:Response) {
        const id_channel = Number(req.params.id_channel);
        const id_server = Number(req.params.id_server);
        const id_message = Number(req.params.id_message);

        if (isNaN(id_server) || isNaN(id_channel) || isNaN(id_message)) {
            res.status(400).json({'message': 'id must be a number'});
            return;
        }

        ServerModel.getMessageFromChannelById(id_server, id_channel, id_message)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({'message': err}))
    }

    public static deleteMessage(req:Request, res:Response) {
        const id_channel = Number(req.params.id_channel);
        const id_server = Number(req.params.id_server);
        const id_message = Number(req.params.id_message);

        if (isNaN(id_server) || isNaN(id_channel) || isNaN(id_message)) {
            res.status(400).json({'message': 'id must be a number'});
            return;
        }

        ServerModel.getMessageFromChannelById(id_server, id_channel, id_message)
        .then(data => {
            if (!data) {
                res.status(404).json({'message': 'message not found'});
                return;
            }

            ServerModel.deleteMessageFromChannel(id_server, id_channel, id_message)
            .then(data => res.status(200).json(data))
            .catch(err => res.status(400).json({'message': err}))
        })
        .catch(err => res.status(400).json({'message': err}))
    }
    
    public static updateMessage(req:Request, res:Response) {
        const id_channel = Number(req.params.id_channel);
        const id_server = Number(req.params.id_server);
        const id_message = Number(req.params.id_message);
        const message = req.body;

        if (isNaN(id_server) || isNaN(id_channel) || isNaN(id_message)) {
            res.status(400).json({'message': 'id must be a number'});
            return;
        }

        ServerModel.getMessageFromChannelById(id_server, id_channel, id_message)
        .then(data => {
            if (!data) {
                res.status(404).json({'message': 'message not found'});
                return;
            }

            ServerModel.updateMessageFromChannel(id_server, id_channel, id_message, message)
            .then(data => res.status(200).json(data))
            .catch(err => res.status(400).json({'message': err}))
        })
    }

    // users

    public static getUsers(req:Request, res:Response)
    {
        const id = Number(req.params.id_server);

        if (isNaN(id)) {
            res.status(400).json({'message': 'id must be a number'});
            return;
        }

        ServerModel.getOne(id)
        .then(data => {

            if (!data) {
                res.status(404).json({'message': 'server not found'});
                return;
            }

            LinkerUsersServerModel.getUsersByServer(id)
            .then(data => res.status(200).json(data))
            .catch(err => res.status(400).json({'message': err}))
        })
        .catch(err => res.status(400).json({'message': err}))

    }

    public static getUserById(req:Request, res:Response)
    {
        const id_user = Number(req.params.id_user);
        const id_server = Number(req.params.id_server);

        if (isNaN(id_user) || isNaN(id_server)) {
            res.status(400).json({'message': 'id must be a number'});
            return;
        }

        ServerModel.getOne(id_server)
        .then(data => {

            if (!data) {
                res.status(404).json({'message': 'server not found'});
                return;
            }

            LinkerUsersServerModel.getUserByServerAndId(id_server, id_user)
            .then(data => res.status(200).json(data))
            .catch(err => res.status(400).json({'message': err}))
        })

    }

    public static addUser(req:Request, res:Response) 
    {
        const user_id = Number(req.params.id_user);
        const server_id = Number(req.params.id_server);

        UserModel.getOne(user_id)
        .then(data => {

            if (!data) {
                res.status(404).json({'message': 'user not found'});
                return;
            }

            ServerModel.getOne(server_id)
            .then(data => {

                if (!data) {
                    res.status(404).json({'message': 'server not found'});
                    return;
                }

                LinkerUsersServerModel.addUserToServer(user_id, server_id)
                .then(data => res.status(200).json(data))
                .catch(err => res.status(400).json({'message': err}))
            })

        })
        .catch(err => res.status(400).json({'message': err}))
    }

    public static removeUser(req:Request, res:Response) 
    {
        const user_id = Number(req.params.id_user);
        const server_id = Number(req.params.id_server);

        LinkerUsersServerModel.removeUser(user_id, server_id)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({'message': err}))
    }
}