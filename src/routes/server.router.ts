import express from 'express';
import { ServerController } from '../controllers/server.controller';

export const serverRouter = express.Router();

serverRouter.get('/', ServerController.getAll);

serverRouter.get('/:id', ServerController.getOne);

serverRouter.post('/', ServerController.create);

serverRouter.patch('/:id', ServerController.update);

serverRouter.delete('/:id', ServerController.delete);

