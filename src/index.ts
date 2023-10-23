import express from "express"
import fileUpload, { FileArray, UploadedFile } from "express-fileupload"
import path from "path"
import cors from "cors"

const app = express()
const port = process.env.PORT || 28322

app
    .use(express.json())
    .use(fileUpload({
        createParentPath: true
    }))
    .use(cors(
        
        {
            origin: '*',
            optionsSuccessStatus: 200
        }
        
    ))
    .get("/", (req, res) => {
        res.status(200).sendFile(path.join(__dirname, "..", "public", "index.html"))
    })
    .post("/save", (req, res) => {
        const files = JSON.parse(JSON.stringify(req.files))

        for(const key in files) {
            const file = req.files![key] as UploadedFile
            file.mv(path.join(__dirname, "..", "uploaded", file.name))
        }
        
        res.redirect('/')
    })
    .listen(port, () => {
        console.log(`App listening on http://localhost:${port}`)
    })
