import { Request, Response } from "express";
import { HttpError } from "../core/httpError.js";
import { ChecklistService } from "../services/checklist.service.js";

export class ChecklistController {
    static async createManyForFormulario(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { template_ids } = req.body;

            const checklistItems = await ChecklistService.createManyForFormulario(
                id,
                template_ids
            );

            return res.status(201).json({
                data: checklistItems,
                error: null,
                message: "Checklist criado com sucesso",
            });
        } catch (err: HttpError | any) {
            console.error("Error:", err);

            return res.status(err.status || 500).json({
                data: null,
                error: err.message,
                message: "Erro ao criar checklist",
            });
        }
    }

    static async updateChecked(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { checked } = req.body;

            const checklist = await ChecklistService.updateChecked(id, checked);

            return res.status(200).json({
                data: checklist,
                error: null,
                message: "Checklist atualizado com sucesso",
            });
        } catch (err: HttpError | any) {
            console.error("Error:", err);

            return res.status(err.status || 500).json({
                data: null,
                error: err.message,
                message: "Erro ao atualizar checklist",
            });
        }
    }

    static async findByFormulario(req: Request, res: Response) {
        try {
            const { formularioId } = req.params;
            const checklist = await ChecklistService.findByFormulario(formularioId);
            return res.status(200).json({
                data: checklist,
                error: null,
                message: "Checklist encontrado com sucesso",
            });
        } catch (err: HttpError | any) {
            return res.status(err.status || 500).json({
                data: null,
                error: err.message,
                message: "Erro ao buscar checklist",
            });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const checklist = await ChecklistService.create(req.body);

            return res.status(201).json({
                data: checklist,
                error: null,
                message: "Checklist criado com sucesso",
            });
        } catch (err: HttpError | any) {
            console.error("Error:", err);

            return res.status(err.status || 500).json({
                data: null,
                error: err.message,
                message: "Erro ao criar checklist",
            });
        }
    }
}