import express from 'express';
import { ChannelController } from '../controllers/channel.controller';

export const channelRouter = express.Router();

// channel // ------------------------------------------------------------------------------------------

channelRouter.get('/', ChannelController.getAll);

channelRouter.get('/:id', ChannelController.getOne);

channelRouter.post('/', ChannelController.create);

channelRouter.patch('/:id', ChannelController.update);

channelRouter.delete('/:id', ChannelController.delete);

// message // ------------------------------------------------------------------------------------------

channelRouter.get('/:id/messages', ChannelController.getMessages);

channelRouter.get('/:id/messages/:id_message', ChannelController.getMessage);

channelRouter.post('/:id/messages', ChannelController.addMessage);

channelRouter.patch('/:id/messages/:id_message', ChannelController.updateMessage);

channelRouter.delete('/:id/messages/:id_message', ChannelController.deleteMessage);

