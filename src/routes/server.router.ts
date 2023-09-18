import express from 'express';
import { ServerController } from '../controllers/server.controller';

export const serverRouter = express.Router();

serverRouter.get('/', ServerController.getAll);

serverRouter.get('/:id', ServerController.getOne);

serverRouter.post('/', ServerController.create);

serverRouter.patch('/:id', ServerController.update);

serverRouter.delete('/:id', ServerController.delete);

serverRouter.get('/:id_server/channels', ServerController.getChannels);

serverRouter.get('/:id_server/channels/:id_channel', ServerController.getChannel);

serverRouter.post('/:id_server/channels', ServerController.addChannel);

serverRouter.get('/:id_server/channels/:id_channel/messages', ServerController.getMessages);

serverRouter.post('/:id_server/channels/:id_channel/messages', ServerController.addMessage);

/*

serverRouter.patch('/:id_server/channels/:id_channel', ServerController.updateChannel);

*/

