import { Request, Response } from "express";
import path from "path";
import { UploadedFile } from "express-fileupload";

export class cdnController {
    public static save(req: Request, res: Response) {
        const files = JSON.parse(JSON.stringify(req.files))
        
        for(const key in files) {
            const file = req.files![key] as UploadedFile
            file.mv(path.join(__dirname, "..", "data", req.body.userName, file.name))
        }
        
        res.status(201).send()
    }
}
