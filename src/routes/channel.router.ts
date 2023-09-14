import express from 'express';
import { ChannelController } from '../controllers/channel.controller';

export const channelRouter = express.Router();

channelRouter.get('/', ChannelController.getAll);

channelRouter.get('/:id', ChannelController.getOne);

channelRouter.post('/', ChannelController.create);

channelRouter.patch('/:id', ChannelController.update);

channelRouter.delete('/:id', ChannelController.delete);

// extras

channelRouter.get('/:id/messages', ChannelController.getMessages);

channelRouter.post('/:id/messages', ChannelController.addMessage);

channelRouter.delete('/:id/messages/:id_message', ChannelController.deleteMessage);

