import { Request, Response } from "express";
import { HttpError } from "../core/httpError.js";
import { CanteiroService } from "../services/canteiro.service.js";

export class CanteiroController {
    static async findAllByUser(req: Request, res: Response) {
        try {
            const { user_id } = req.query;

            const canteiros = await CanteiroService.findByUser(
                String(user_id || "")
            );

            return res.status(200).json({
                data: canteiros,
                error: null,
                message: "Canteiros encontrados com sucesso",
            });
        } catch (err: HttpError | any) {
            return res.status(err.status || 500).json({
                data: null,
                error: err.message,
                message: "Erro ao buscar canteiros",
            });
        }
    }
    
    static async findByUser(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const canteiros = await CanteiroService.findByUser(userId);
            return res.status(200).json(canteiros);
        } catch (err: HttpError | any) {
            return res.status(err.status || 500).json({ error: err.message });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const canteiro = await CanteiroService.create(req.body);
            return res.status(201).json(canteiro);
        } catch (err: HttpError | any) {
            return res.status(err.status || 500).json({ error: err.message });
        }
    }
}
