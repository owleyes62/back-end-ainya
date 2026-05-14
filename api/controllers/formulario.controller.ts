import { Request, Response } from "express";
import { HttpError } from "../core/httpError.js";
import { FormularioService } from "../services/formulario.service.js";

export class FormularioController {
    static async findAllByUser(req: Request, res: Response) {
        try {
            const { user_id } = req.query;

            const formularios = await FormularioService.findAllByUser(
                String(user_id || "")
            );

            return res.status(200).json({
                data: formularios,
                error: null,
                message: "Formulários encontrados com sucesso",
            });
        } catch (err: HttpError | any) {
            console.error("Error:", err);

            return res.status(err.status || 500).json({
                data: null,
                error: err.message,
                message: "Erro ao buscar formulários",
            });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const formulario = await FormularioService.create(req.body);

            return res.status(201).json({
                data: formulario,
                error: null,
                message: "Formulário criado com sucesso",
            });
        } catch (err: HttpError | any) {
            console.error("Error:", err);

            return res.status(err.status || 500).json({
                data: null,
                error: err.message,
                message: "Erro ao criar formulário",
            });
        }
    }

    static async finalizar(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const formulario = await FormularioService.finalizar(id);

            return res.status(200).json({
                data: formulario,
                error: null,
                message: "Formulário finalizado com sucesso",
            });
        } catch (err: HttpError | any) {
            console.error("Error:", err);

            return res.status(err.status || 500).json({
                data: null,
                error: err.message,
                message: "Erro ao finalizar formulário",
            });
        }
    }

    static async sync(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const formulario = await FormularioService.sync(id, req.body);

            return res.status(200).json({
                data: formulario,
                error: null,
                message: "Formulário sincronizado com sucesso",
            });
        } catch (err: HttpError | any) {
            console.error("Error:", err);

            return res.status(err.status || 500).json({
                data: null,
                error: err.message,
                message: "Erro ao sincronizar formulário",
            });
        }
    }
}