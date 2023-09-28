import express from 'express'
import { Server as httpsServer, ServerOptions} from 'https'
import { Server as socketServer, WebSocket} from 'ws'
import cors from 'cors'
import path from 'path'

const privateKey = path.join(__dirname, '..', 'public/certs/selfsigned.key')
const certificate = path.join(__dirname, '..', 'public/certs/selfsigned.crt')
const credentials = { key: privateKey, cert: certificate }

const port = process.env.PORT || 4356
const app = express()
const server = new httpsServer(credentials, app)
const wss = new socketServer({ server })

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}

let sockets = new Map<string, WebSocket>()

const sendTo = (con: WebSocket, obj: object) => {
    con.send(JSON.stringify(obj))
}

app
    .use(cors(corsOptions))
    .use(express.json())
    .get('/chat', (req, res) => {
        res.status(200).sendFile(path.join(__dirname, '..', 'public/index.html'))
    })
    .get('/vc', (req, res) => {
        res.status(200).sendFile(path.join(__dirname, '..', 'public/voice.html'))
    })

const resolveName = (ws: WebSocket): string => {
    let name: string = 'nameless'
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
                    var name: string = data.name
                    if(sockets.get(name)) {
                        sendTo(ws, {
                            type: 'login',
                            success: false
                        })
                    }
                    else {
                        sockets.set(name, ws)
                        sendTo(ws, {
                            type: 'login',
                            success: true
                        })
                    }
                break

                case 'msg':
                    var name: string = resolveName(ws)
                    sockets.forEach((val) => {
                        if(val !== ws) { 
                            sendTo(ws, {
                                type: 'message',
                                name: name,
                                content: data.content
                            })
                        }
                    })
                break
            
                case 'offer':
                    console.log(`Creating call offer for: ${data.target}`)
                    
                    var user = sockets.get(data.target)

                    if(user) {
                        sendTo(user, {
                            type: 'offer',
                            offer: data.offer,
                            name: resolveName(ws)
                        })
                    }
                break
                
                case 'answer':
                    var user = sockets.get(data.target)

                    if(user) {
                        sendTo(user, {
                            type: 'answer',
                            answer: data.answer,
                        })
                    }
                break

                case 'candidate':
                    var user = sockets.get(data.target)

                    if(user) {
                        sendTo(user,{
                            type: 'offer',
                            offer: data.offer,
                            name: resolveName(ws)
                        })
                    }
                break

                case 'leave':
                    var user = sockets.get(data.target)

                    if(user) {
                        sendTo(user,{
                            type: 'leave'
                        })
                    }
                break
            }
        })

        ws.on('close', () => {
            console.log(`stopped connection from: ${req.socket.remoteAddress}`)
            sockets.forEach( (val, key) => {
                if(val == ws) {
                    sockets.delete(key)
                }
            })
        })
    })

server
    .listen(port, () => {
        console.log(`HTTP Server hosted on: http://localhost:${port}`)
    })