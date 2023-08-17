import express from 'express'
import dotenv from 'dotenv'

const app = express()
dotenv.config()

app
    .use(express.json())
    .get('/', (req, res) => {
        res.status(200).send('NANKUTURIAS')
    })
    .listen(process.env.PORT, () => {
        console.log(`API hosted on: http://localhost:${process.env.PORT}`)
    })