import { Request, Response } from "express";
import { HttpError } from "../core/httpError.js";
import { PhotoService } from "../services/photo.service.js";

export class PhotoController {
    static async createForFormulario(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!req.file) {
                throw new HttpError("Arquivo de foto é obrigatório", 400);
            }

            const fileUrl = `/uploads/${req.file.filename}`;

            const photo = await PhotoService.create({
                form_id: id,
                url: fileUrl,
            });

            return res.status(201).json({
                data: photo,
                error: null,
                message: "Foto enviada com sucesso",
            });
        } catch (err: HttpError | any) {
            console.error("Error:", err);

            return res.status(err.status || 500).json({
                data: null,
                error: err.message,
                message: "Erro ao enviar foto",
            });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const photo = await PhotoService.create(req.body);

            return res.status(201).json({
                data: photo,
                error: null,
                message: "Foto criada com sucesso",
            });
        } catch (err: HttpError | any) {
            console.error("Error:", err);

            return res.status(err.status || 500).json({
                data: null,
                error: err.message,
                message: "Erro ao criar foto",
            });
        }
    }
}