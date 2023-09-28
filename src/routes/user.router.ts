import { Router } from 'express'
import { UserController } from '../controllers/user.controller';
import { auth } from '../middleware/auth.middleware';

export const userRouter = Router()

userRouter.get('/', auth, UserController.getAll);

userRouter.get('/:id', UserController.getOne);

userRouter.patch('/:id', UserController.update);

userRouter.delete('/:id', UserController.delete);

userRouter.post('/register', UserController.register);

userRouter.post('/login', UserController.login);

//userRouter.post('/', UserController.create); [DEPRECATED - USE REGISTER]