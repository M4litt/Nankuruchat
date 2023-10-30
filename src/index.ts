import express from "express"
import fileUpload, { UploadedFile } from "express-fileupload"
import path from "path"
import cors from "cors"
import dotenv from "dotenv"

const app = express()
const port = process.env.PORT || 28322

const fileUploadConfig = {
    limits: {
        fileSize: 4 * (1024**2)
    },
    createParentPath: true,
    abortOnLimit: true
}

const corsConfig = {
    origin: '*',
    optionsSuccessStatus: 200
}

app
    .use(express.json())
    .use(fileUpload(fileUploadConfig))
    .use(cors(corsConfig))
    .get("/", (req, res) => {
        res.status(200).sendFile(path.join(__dirname, "..", "public", "index.html"))
    })
    .post("/save", (req, res) => {
        const files = JSON.parse(JSON.stringify(req.files))

        
        for(const key in files) {
            const file = req.files![key] as UploadedFile
            file.mv(path.join(__dirname, "..", "data", req.body.userName, file.name))
        }
        
        res.status(201).redirect('/')/*.send({ created: true }) */ //! Replace .redirect() with .send() before deployment
    })
    .listen(port, () => {
        console.log(`App listening on http://localhost:${port}`)
    })
