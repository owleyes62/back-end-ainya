import { Request, Response } from "express";
import { HttpError } from "../core/httpError.js";
import { RelatorioService } from "../services/relatorio.service.js";
        
export class RelatorioController {

    static async findByUser(req: Request, res: Response) {
        try {

            const userId = req.params.userId as string; 
            const relatorios = await RelatorioService.getRelatoriosByUser(userId);
            return res.status(200).json(relatorios);
        } catch (err: HttpError | any) {
            console.error("Error:", err);
            return res.status(err.status || 500).json({ error: err.message });
        }
    }

    static async generate(req: Request, res: Response) {
        try {
            const { user_id, list_id } = req.body;

            if (!user_id || !list_id) {
                return res.status(400).json({ error: "user_id e list_id são obrigatórios." });
            }

            const novoRelatorio = await RelatorioService.createRelatorio(user_id, list_id);
            return res.status(201).json(novoRelatorio);
        } catch (err: HttpError | any) {
            console.error("Error:", err);
            return res.status(err.status || 500).json({ error: err.message });
        }
    }

    // Atividade 2 - Controlador para buscar relatório por ID
    static async findById(req: Request, res: Response) {
        try {
            // Pega o ID que virá na URL (ex: /api/relatorios/12345)
            const id = req.params.id as string;
            
            const relatorio = await RelatorioService.getRelatorioById(id);
            return res.status(200).json(relatorio);
        } catch (err: HttpError | any) {
            console.error("Error:", err);
            return res.status(err.status || 500).json({ error: err.message });
        }
    }

    // Atividade 2 - Controlador para atualizar o objetivo
    static async updateObjective(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            // Pega o novo texto que o Front-end enviou no corpo da requisição
            const { objective } = req.body;

            if (objective === undefined) {
                return res.status(400).json({ error: "O campo objective é obrigatório para atualização." });
            }

            const relatorioAtualizado = await RelatorioService.updateObjective(id, objective);
            return res.status(200).json(relatorioAtualizado);
        } catch (err: HttpError | any) {
            console.error("Error:", err);
            return res.status(err.status || 500).json({ error: err.message });
        }
    }
}