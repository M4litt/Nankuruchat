import express from 'express';
import { MessageController } from '../controllers/message.controller';

export const MessageRouter = express.Router();

MessageRouter.get('/', MessageController.getAll);

MessageRouter.get('/:id', MessageController.getOne);

MessageRouter.post('/', MessageController.create);

MessageRouter.patch('/:id', MessageController.update);

MessageRouter.delete('/:id', MessageController.delete);
