import { Request, Response } from "express";
import { HttpError } from "../core/httpError.js";
import { PlantTemplateService } from "../services/planttemplate.service.js";

export class PlantTemplateController {
    static async findAllByPlant(req: Request, res: Response) {
        try {
            const { plant_id } = req.query;

            const templates = await PlantTemplateService.findAllByPlant(
                String(plant_id || "")
            );

            return res.status(200).json({
                data: templates,
                error: null,
                message: "Templates da planta encontrados com sucesso",
            });
        } catch (err: HttpError | any) {
            console.error("Error:", err);

            return res.status(err.status || 500).json({
                data: null,
                error: err.message,
                message: "Erro ao buscar templates da planta",
            });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const template = await PlantTemplateService.create(req.body);

            return res.status(201).json({
                data: template,
                error: null,
                message: "Template da planta criado com sucesso",
            });
        } catch (err: HttpError | any) {
            console.error("Error:", err);

            return res.status(err.status || 500).json({
                data: null,
                error: err.message,
                message: "Erro ao criar template da planta",
            });
        }
    }
}