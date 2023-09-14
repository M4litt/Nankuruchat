import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express()
const httpServer = createServer(app)
const IOserver = new Server(httpServer)
dotenv.config()

const corsConfig = {
    origin: '*',
    optionsSuccessStatus: 200
}
const port = 1836

app
    .use(express.json())
    .use(cors(corsConfig))
    .get('/', (req, res) => {
        res.status(200).sendFile(path.join(__dirname, '../public/index.html'))
    })
//    .listen(port, () => {
//        console.log(`API listening on: http://127.0.0.1:${port}`)
//    })

IOserver.on('connection', socket => {
    IOserver.emit('user_connect', 'User joined the chat room!')

    socket.on('message_send', pkg => {
        IOserver.emit('message_broadcast', `${pkg.name}> ${pkg.data}`)
        console.log(pkg)
    })

    socket.on('disconnect', () => {
        IOserver.emit('user_disconnect', 'User left the chat room...')
    })
})

httpServer
    .listen(port, () => {
        console.log(`Http Server listening on: http://127.0.0.1:${port}`)
    })
