import express from 'express'
import { UserController } from '../controllers/user.controller';

export const userRouter = express.Router()

userRouter.get('/', UserController.getAll);

userRouter.get('/:id', UserController.getOne);

userRouter.post('/', UserController.create);

userRouter.patch('/:id', UserController.update);

userRouter.delete('/:id', UserController.delete);
