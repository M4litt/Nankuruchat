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


userRouter.get('/:id/servers', UserController.getServers);
userRouter.get('/email/:email', UserController.getByEmail);

// blocked
userRouter.get('/:id/blocked', UserController.getBlockedUsers);
userRouter.post('/:id/block/:blocked_id', UserController.blockUser);
userRouter.delete('/:id/unblock/:blocked_id', UserController.unblockUser);

// friends
userRouter.get('/:id/friends', UserController.getFriends);
userRouter.post('/:id/friend/:friend_id', UserController.addFriend);
userRouter.delete('/:id/friend/:friend_id', UserController.removeFriend);

// enemies
userRouter.get('/:id/enemies', UserController.getEnemies);
userRouter.post('/:id/enemy/:enemy_id', UserController.addEnemy);
userRouter.delete('/:id/enemy/:enemy_id', UserController.removeEnemy);