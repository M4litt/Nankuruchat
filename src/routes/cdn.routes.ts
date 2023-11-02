import express from "express";
import { cdnController } from "../controllers/cdn.controller";

export const cdnRouter = express.Router()

cdnRouter
    .post("/save", cdnController.save)
