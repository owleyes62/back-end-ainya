import { Request, Response } from "express";
import { HttpError } from "../core/httpError.js";
import { TurmaService } from "../services/turma.service.js";

export class TurmaController {
    static async findById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const turma = await TurmaService.findById(id);
            return res.status(200).json(turma);
        } catch (err: HttpError | any) {
            return res.status(err.status || 500).json({ error: err.message });
        }
    }

    static async findAll(_req: Request, res: Response) {
        try {
            const turmas = await TurmaService.findAll();
            return res.status(200).json(turmas);
        } catch (err: HttpError | any) {
            return res.status(err.status || 500).json({ error: err.message });
        }
    }
}
