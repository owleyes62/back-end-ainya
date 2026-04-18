
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
}
    