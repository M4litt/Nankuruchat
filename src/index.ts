import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import * as db from './db';
import cors from 'cors';

// routes
import { userRouter }    from './routes/user.router';
import { MessageRouter } from './routes/message.router';
import { channelRouter } from './routes/channel.router';
import { serverRouter }  from './routes/server.router';

// auth
import { auth } from './middleware/auth.middleware';

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    console.log(`NankuruChat-back deployed on http://localhost:${PORT}`);
});

db.init();

app.get('/', (req:Request, res:Response) => res.status(200).json('NankuruBack is awaken <👁>'));
app.use('/user',    userRouter);
app.use('/message', auth, MessageRouter);
app.use('/channel', auth, channelRouter);
app.use('/server',  auth, serverRouter);