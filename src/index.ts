import express, { Request, Response } from 'express';
import fileUpload from "express-fileupload";
import dotenv from 'dotenv';
import * as db from './db';
import cors from 'cors';

// routes
import { userRouter }    from './routes/user.routes';
import { MessageRouter } from './routes/message.routes';
import { channelRouter } from './routes/channel.routes';
import { serverRouter }  from './routes/server.routes';
import { cdnRouter }     from './routes/cdn.routes';

// auth
import { auth } from './middleware/auth.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

const fileUploadConfig = {
    limits: { fileSize: 4 * (1024**2) },
    createParentPath: true,
    abortOnLimit: true
};

const corsConfig = {
    origin: '*',
    optionsSuccessStatus: 200
};

app
.use(cors(corsConfig))
.use(fileUpload(fileUploadConfig))
.use(express.json())
.use('/user',          userRouter)
.use('/message', auth, MessageRouter)
.use('/channel', auth, channelRouter)
.use('/server',  auth, serverRouter)
.use('/cdn',           cdnRouter)
.get('/', (req:Request, res:Response) => res.status(200).json('NankuruBack is awaken <👁>'))
.use('/public', express.static('data'))
.listen(PORT, () => console.log(`NankuruChat-back deployed on http://localhost:${PORT}`));

db.init();
