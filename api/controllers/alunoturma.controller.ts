import { Request, Response } from "express";
import { HttpError } from "../core/httpError.js";
import { AlunoTurmaService } from "../services/alunoturma.service.js";

export class AlunoTurmaController {
    static async create(req: Request, res: Response) {
        try {
            const vinculo = await AlunoTurmaService.create(req.body);
            return res.status(201).json(vinculo);
        } catch (err: HttpError | any) {
            return res.status(err.status || 500).json({ error: err.message });
        }
    }

    static async findByUser(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const vinculos = await AlunoTurmaService.findByUser(userId);
            return res.status(200).json(vinculos);
        } catch (err: HttpError | any) {
            return res.status(err.status || 500).json({ error: err.message });
        }
    }
}
