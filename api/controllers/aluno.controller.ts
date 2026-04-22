
import { Request, Response } from "express";
import { HttpError } from "../core/httpError";
import { AlunoService } from "../services/aluno.service";
        
export class AlunoController {
    static async create(req: Request, res: Response) {
        try {
            await AlunoService.create(req.body);
            return res.status(201).json({ message: "created successfully" });
        } catch (err: HttpError | any) {
            console.error("Error:", err);
            return res.status(err.status || 500).json({ error: err.message });
        }
    }
}
    