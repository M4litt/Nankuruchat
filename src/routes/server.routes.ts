import express from 'express';
import { ServerController } from '../controllers/server.controller';

export const serverRouter = express.Router();


// server // ------------------------------------------------------------------------------------------

serverRouter.get('/', ServerController.getAll);

serverRouter.get('/:id', ServerController.getOne);

serverRouter.post('/', ServerController.create);

serverRouter.patch('/:id', ServerController.update);

serverRouter.delete('/:id', ServerController.delete);

//channels // -----------------------------------------------------------------------------------------

serverRouter.get('/:id_server/channels', ServerController.getChannels);

serverRouter.get('/:id_server/channels/:id_channel', ServerController.getChannel);

serverRouter.post('/:id_server/channels', ServerController.addChannel);

serverRouter.delete('/:id_server/channels/:id_channel', ServerController.deleteChannel);

serverRouter.patch('/:id_server/channels/:id_channel', ServerController.updateChannel)

// messages // ----------------------------------------------------------------------------------------

serverRouter.get('/:id_server/channels/:id_channel/messages', ServerController.getMessages);

serverRouter.post('/:id_server/channels/:id_channel/messages', ServerController.addMessage);

serverRouter.delete('/:id_server/channels/:id_channel/messages/:id_message', ServerController.deleteMessage);

serverRouter.patch('/:id_server/channels/:id_channel/messages/:id_message', ServerController.updateMessage);

// users // -------------------------------------------------------------------------------------------

serverRouter.get('/:id_server/users', ServerController.getUsers);

serverRouter.get('/:id_server/users/:id_user', ServerController.getUserById);

serverRouter.post('/:id_server/users/:id_user', ServerController.addUser);

serverRouter.delete('/:id_server/users/:id_user', ServerController.removeUser);

