import { Request, Response } from "express";
import { HttpError } from "../core/httpError.js";
import { AlunoService } from "../services/aluno.service.js";

export class AlunoController {
    static async getResumo(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const resumo = await AlunoService.getResumo(id);

            return res.status(200).json({
                data: resumo,
                error: null,
                message: "Resumo do aluno encontrado com sucesso",
            });
        } catch (err: HttpError | any) {
            return res.status(err.status || 500).json({
                data: null,
                error: err.message,
                message: "Erro ao buscar resumo do aluno",
            });
        }
    }
}