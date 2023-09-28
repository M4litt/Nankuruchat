import express from 'express'
import { Server as httpServer} from 'http'
import { Server as socketServer, WebSocket} from 'ws'
import cors from 'cors'
import path from 'path'

const port = process.env.PORT || 4356
const app = express()
const server = new httpServer(app)
const wss = new socketServer({ server })

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}

let sockets = new Map<string, WebSocket>()

app
    .use(cors(corsOptions))
    .use(express.json())
    .get('/', (req, res) => {
        res.status(200).sendFile(path.join(__dirname, '..', 'public/index.html'))
    })

const resolveName = (ws: WebSocket) => {
    let name
    sockets.forEach((val, key) => {
        if (val == ws) {
            name = key
        }
    })
    return name
}

wss
    .on('connection', (ws, req) => {
        console.log(`started connection from: ${req.socket.remoteAddress}`) 

        ws.on('message', (msg) => {
            const data = JSON.parse(msg.toString())

            switch(data.type){
                case 'login':
                    const name: string = data.name
                    if(sockets.get(name)) {
                        ws.send(JSON.stringify({'failed': 'User already exists'}))
                    }
                    else {
                        sockets.set(name, ws)
                        ws.send(JSON.stringify({'success': 'User logged'}))
                    }
                    break

                case 'msg':
                    const disName = resolveName(ws)
                    console.log(`Sending: ${disName}: ${data.content}`)
                    sockets.forEach((val) => {
                        if(val !== ws) { val.send(JSON.stringify({name: disName, content: data.content})) }
                    })
                    break
            }

        })

        ws.on('close', () => {
            console.log(`stopped connection from: ${req.socket.remoteAddress}`)
            sockets.forEach( (val, key) => {
                if(val == ws) {
                    console.log(`${key} disconnected...`)
                    sockets.delete(key)
                }
            })
        })
    })

server
    .listen(port, () => {
        console.log(`HTTP Server hosted on: http://localhost:${port}`)
    })