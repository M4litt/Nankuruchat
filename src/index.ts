import express from 'express'
import dotenv from 'dotenv'
import { userRouter } from './routes/user.router';
import * as db from './db';
import { MessageRouter } from './routes/message.router';
import { channelRouter } from './routes/channel.router';
import { serverRouter } from './routes/server.router';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`NankuruChat-back deployed on http://localhost:${PORT}`);
});

db.init();

app.use('/user',    userRouter);
app.use('/message', MessageRouter);
app.use('/channel', channelRouter);
app.use('/server',  serverRouter);