import { Request, Response } from "express";
import { HttpError } from "../core/httpError.js";
import { MeasurementService } from "../services/measurement.service.js";

export class MeasurementController {
    static async createManyForFormulario(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { measurements } = req.body;

            const measurementItems = await MeasurementService.createManyForFormulario(
                id,
                measurements
            );

            return res.status(201).json({
                data: measurementItems,
                error: null,
                message: "Medições criadas com sucesso",
            });
        } catch (err: HttpError | any) {
            console.error("Error:", err);

            return res.status(err.status || 500).json({
                data: null,
                error: err.message,
                message: "Erro ao criar medições",
            });
        }
    }

    static async updateValue(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { value } = req.body;

            const measurement = await MeasurementService.updateValue(id, value);

            return res.status(200).json({
                data: measurement,
                error: null,
                message: "Medição atualizada com sucesso",
            });
        } catch (err: HttpError | any) {
            console.error("Error:", err);

            return res.status(err.status || 500).json({
                data: null,
                error: err.message,
                message: "Erro ao atualizar medição",
            });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const measurement = await MeasurementService.create(req.body);

            return res.status(201).json({
                data: measurement,
                error: null,
                message: "Medição criada com sucesso",
            });
        } catch (err: HttpError | any) {
            console.error("Error:", err);

            return res.status(err.status || 500).json({
                data: null,
                error: err.message,
                message: "Erro ao criar medição",
            });
        }
    }
}