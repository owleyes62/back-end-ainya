
import { Request, Response } from "express";
import { HttpError } from "../core/httpError";
import { ProfessorService } from "../services/professor.service";
        
export class ProfessorController {
    static async create(req: Request, res: Response) {
        try {
            await ProfessorService.create(req.body);
            return res.status(201).json({ message: "created successfully" });
        } catch (err: HttpError | any) {
            console.error("Error:", err);
            return res.status(err.status || 500).json({ error: err.message });
        }
    }
}
    