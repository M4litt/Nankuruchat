import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import * as db from './db';
import { userRouter }    from './routes/user.router';
import { MessageRouter } from './routes/message.router';
import { channelRouter } from './routes/channel.router';
import { serverRouter }  from './routes/server.router';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`NankuruChat-back deployed on http://localhost:${PORT}`);
});

db.init();

app.get('/', (req:Request, res:Response) => res.status(200).send('NankuruBack is awaken <👁>'));
app.use('/user',    userRouter);
app.use('/message', MessageRouter);
app.use('/channel', channelRouter);
app.use('/server',  serverRouter);