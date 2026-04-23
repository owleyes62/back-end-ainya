
import { Request, Response } from "express";
import { HttpError } from "../core/httpError";
import { UserService } from "../services/user.service";
        
export class UserController {
    static async create(req: Request, res: Response) {
        try {
            await UserService.create(req.body);
            return res.status(201).json({ message: "created successfully" });
        } catch (err: HttpError | any) {
            console.error("Error:", err);
            return res.status(err.status || 500).json({ error: err.message });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const token = await UserService.login(req.body);
            return res.status(200).json({ token });
        } catch (err: HttpError | any) {
            console.error("Error:", err);
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
}
    