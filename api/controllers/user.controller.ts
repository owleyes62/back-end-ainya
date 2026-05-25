
import { Request, Response } from "express";
import { put } from "@vercel/blob";
import { HttpError } from "../core/httpError.js";
import { UserService } from "../services/user.service.js";

export class UserController {
    static async create(req: Request, res: Response) {
        try {
            await UserService.create(req.body);
            return res.status(201).json({ message: "created successfully" });
        } catch (err: HttpError | any) {
            return res.status(err.status || 500).json({ error: err.message });
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const users = await UserService.getAll();
            return res.status(200).json(users);
        } catch (err: HttpError | any) {
            console.error("Error:", err);
            return res.status(err.status || 500).json({ error: err.message });
        }
    }

    static async findById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = await UserService.findById(id);
            return res.status(200).json(user);
        } catch (err: HttpError | any) {
            return res.status(err.status || 500).json({ error: err.message });
        }
    }

    static async updateProfile(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = await UserService.updateProfile(id, req.body);
            return res.status(200).json(user);
        } catch (err: HttpError | any) {
            return res.status(err.status || 500).json({ error: err.message });
        }
    }

    static async updateAvatar(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!req.file) {
                throw new HttpError("Arquivo de avatar é obrigatório", 400);
            }

            // Em prod (Vercel) o multer usa memoryStorage → req.file.buffer.
            // Em dev usa diskStorage → req.file.filename.
            let fileUrl: string;

            if (process.env.VERCEL) {
                const blob = await put(
                    `avatars/${id}-${Date.now()}-${req.file.originalname}`,
                    req.file.buffer,
                    { access: "public", contentType: req.file.mimetype }
                );
                fileUrl = blob.url;
            } else {
                fileUrl = `/uploads/${req.file.filename}`;
            }

            const user = await UserService.updateAvatar(id, fileUrl);
            return res.status(200).json(user);
        } catch (err: HttpError | any) {
            return res.status(err.status || 500).json({ error: err.message });
        }
    }
}
