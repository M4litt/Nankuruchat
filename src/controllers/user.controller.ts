import { Request, Response } from "express";
import { createHash } from "node:crypto";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { User, UserJson } from "../types/user.type";
import fs from 'fs'

// models
import { UserModel } from "../models/user.model";
import { FriendsModel } from "../models/friends.model";
import { EnemiesModel } from "../models/enemies.model";
import { BlockedModel } from "../models/blocked.model";
import { LinkerUsersServerModel } from "../models/linker_users_server.model";
import { ServerModel } from "../models/server.model";
import { ServerJson } from "./server.controller";

dotenv.config()

export class UserController {

    public static async getAll(req:Request, res:Response) {

        let promises: Promise<UserJson>[] = [];

        await UserModel.getAll()
        .then(users => {
            users.forEach(user => promises.push(
                new Promise((resolve, reject) => {
                    const userJson:UserJson = 
                    {
                        id:          user.id,
                        username:    user.username,
                        pfp:         user.pfp,
                        email:       user.email,
                        description: user.description,
                        friends:     [],
                        enemies:     []
                    }
                    FriendsModel.getFriends(user.id)
                    .then(friends => {
                    
                    let friendsJson:UserJson[] = [];

                    // cast user to userJson
                    friends.forEach(friend => friendsJson.push(friend.toUserJson()));

                    userJson.friends = friendsJson;

                    EnemiesModel.getEnemies(user.id)
                    .then(enemies => {

                        let enemiesJson:UserJson[] = [];

                        // cast user to userJson
                        enemies.forEach(enemy => enemiesJson.push(enemy.toUserJson()));

                        userJson.enemies = enemiesJson;

                        resolve(userJson)
                })
                .catch(err => reject(err));
            })
            .catch(err => reject(err));

            })));

            Promise.all(promises)
            .then(data => res.status(200).json(data))
            .catch(err => res.status(400).json({'message': err}))
        }
        )
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
        .then((user) => 
        {
            if (!user) return;

            const userJson:UserJson = 
            {
                id:          user.id,
                username:    user.username,
                pfp:         user.pfp,
                email:       user.email,
                description: user.description,
                friends:     [],
                enemies:     []
            }
            FriendsModel.getFriends(user.id)
            .then(friends => {
                
                let friendsJson:UserJson[] = [];

                // cast user to userJson
                friends.forEach(friend => friendsJson.push(friend.toUserJson()));

                userJson.friends = friendsJson;

                EnemiesModel.getEnemies(user.id)
                .then(enemies => {

                    let enemiesJson:UserJson[] = [];

                    // cast user to userJson
                    enemies.forEach(enemy => enemiesJson.push(enemy.toUserJson()));

                    userJson.enemies = enemiesJson;

                    res.status(200).json(userJson);
                })
                .catch(err => res.status(400).json({'message': err}));
            })
            .catch(err => res.status(400).json({'message': err}))
        })
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

    private static isPasswordValid(password:string):boolean
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
        const token = fs.readFileSync(process.env.JWT_SECRET!, 'utf-8')
        return jwt.sign(
            user,
            token || 'invalid-secret',
            {
                expiresIn: '24h'
            }
        )
    }

    // friends
    public static getFriends(req:Request, res:Response) {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({'message': 'id must be a number'});
            return;
        }

        FriendsModel.getFriends(id)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({'message': err}))
    }
    public static addFriend(req:Request, res:Response) {
        const id = Number(req.params.id);
        const friend_id = Number(req.params.friend_id);

        if (isNaN(id) || isNaN(friend_id)) {
            res.status(400).json({'message': 'id must be a number'});
            return;
        }

        if (id == friend_id) {
            res.status(400).json({'message': 'you cannot add yourself as a friend'});
            return;
        }

        UserModel.getOne(id)
        .then(data => {
            
            // if user not found
            if (!data) {
                res.status(400).json({'message': 'user not found'});
                return;
            }

            UserModel.getOne(friend_id)
            .then(data => {

                // if to-be-friended user not found
                if (!data) {
                    res.status(400).json({'message': 'to-be-friended user not found'});
                    return;
                }

                FriendsModel.addFriend(id, friend_id)
                .then(data => res.status(200).json(data))
                .catch(err => res.status(400).json({'message': err}))
            })
            .catch(err => res.status(400).json({'message': err}))
        })
        .catch(err => res.status(400).json({'message': err}))
    }
    public static removeFriend(req:Request, res:Response) {
        const id = Number(req.params.id);
        const friend_id = Number(req.params.friend_id);

        if (isNaN(id) || isNaN(friend_id)) {
            res.status(400).json({'message': 'id must be a number'});
            return;
        }

        FriendsModel.removeFriend(id, friend_id)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({'message': err}))
    }

    // enemies
    public static getEnemies(req:Request, res:Response) {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({'message': 'id must be a number'});
            return;
        }

        EnemiesModel.getEnemies(id)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({'message': err}))
    }
    public static addEnemy(req:Request, res:Response) {
        const id = Number(req.params.id);
        const enemy_id = Number(req.params.enemy_id);

        if (isNaN(id) || isNaN(enemy_id)) {
            res.status(400).json({'message': 'id must be a number'});
            return;
        }

        if (id == enemy_id) {
            res.status(400).json({'message': 'you cannot add yourself as an enemy'});
            return;
        }

        UserModel.getOne(id)
        .then(data => {
            
            // if user not found
            if (!data) {
                res.status(400).json({'message': 'user not found'});
                return;
            }

            UserModel.getOne(enemy_id)
            .then(data => {

                // if to-be-enemied user not found
                if (!data) {
                    res.status(400).json({'message': 'to-be-enemied user not found'});
                    return;
                }

                EnemiesModel.addEnemy(id, enemy_id)
                .then(data => res.status(200).json(data))
                .catch(err => res.status(400).json({'message': err}))
            })
            .catch(err => res.status(400).json({'message': err}))
        })
        .catch(err => res.status(400).json({'message': err}))

    }
    public static removeEnemy(req:Request, res:Response) 
    {
        const id = Number(req.params.id);
        const enemy_id = Number(req.params.enemy_id);

        if (isNaN(id) || isNaN(enemy_id)) {
            res.status(400).json({'message': 'id must be a number'});
            return;
        }

        EnemiesModel.removeEnemy(id, enemy_id)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({'message': err}))
    }

    // blocked
    public static getBlockedUsers(req:Request, res:Response) 
    {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({'message': 'id must be a number'});
            return;
        }

        BlockedModel.getBlockedUsers(id)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({'message': err}))
    }
    public static blockUser(req:Request, res:Response) 
    {
        const id = Number(req.params.id);
        const blocked_id = Number(req.params.blocked_id);

        if (isNaN(id) || isNaN(blocked_id)) {
            res.status(400).json({'message': 'id must be a number'});
            return;
        }

        if (id == blocked_id) { 
            res.status(400).json({'message': 'you cannot block yourself'});
            return;
        }

        UserModel.getOne(id)
        .then(data => {
            
            // if user not found
            if (!data) {
                res.status(400).json({'message': 'user not found'});
                return;
            }

            UserModel.getOne(blocked_id)
            .then(data => {

                // if to-be-blocked user not found
                if (!data) {
                    res.status(400).json({'message': 'to-be-blocked user not found'});
                    return;
                }

                // block user
                BlockedModel.blockUser(id, blocked_id)
                .then(data => res.status(200).json(data))
                .catch(err => res.status(400).json({'message': err}))
            })
            .catch(err => res.status(400).json({'message': err}))
        })
        .catch(err => res.status(400).json({'message': err}))
    }
    public static unblockUser(req:Request, res:Response) 
    {
        const id = Number(req.params.id);
        const blocked_id = Number(req.params.blocked_id);

        if (isNaN(id) || isNaN(blocked_id)) {
            res.status(400).json({'message': 'id must be a number'});
            return;
        }

        BlockedModel.unblockUser(id, blocked_id)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({'message': err}))
    }

    public static getServers(req:Request, res:Response)
    {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({'message': 'id must be a number'});
            return;
        }

        LinkerUsersServerModel.getServersByUser(id)
        .then(async(servers) =>
        {
            let threadPool:Promise<any>[] = [];
            
            servers.forEach(server => 
            {
                threadPool.push(
                    new Promise((resolve, reject) => {
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
                );
            });
            const serversJson = await Promise.all(threadPool);   

            res.status(200).json(serversJson);
        })
        .catch(err => res.status(400).json({'message': err}))
    }

    public static getByEmail(req:Request, res:Response)
    {
        const email = req.params.email;

        UserModel.getByEmail(email)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({'message': err}))
    }
    
}