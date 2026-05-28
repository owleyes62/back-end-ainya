import { Request, Response } from "express";
import { HttpError } from "../core/httpError.js";
import { ListaDeFormulariosService } from "../services/listadeformularios.service.js";

export class ListaDeFormulariosController {
    static async create(req: Request, res: Response) {
        try {
            // created_by sempre vem do JWT (requireAuth) — body não controla mais.
            const lista = await ListaDeFormulariosService.create({
                ...req.body,
                created_by: req.user!.id,
            });
            return res.status(201).json(lista);
        } catch (err: HttpError | any) {
            return res.status(err.status || 500).json({ error: err.message });
        }
    }

    static async findById(req: Request, res: Response) {
        try {
            const { listaId } = req.params;
            const lista = await ListaDeFormulariosService.findById(listaId);
            return res.status(200).json(lista);
        } catch (err: HttpError | any) {
            return res.status(err.status || 500).json({ error: err.message });
        }
    }

    static async findByCanteiro(req: Request, res: Response) {
        try {
            const { canteiroId } = req.params;
            const listas = await ListaDeFormulariosService.findByCanteiro(canteiroId);
            return res.status(200).json(listas);
        } catch (err: HttpError | any) {
            return res.status(err.status || 500).json({ error: err.message });
        }
    }

    static async findFormularios(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const formularios = await ListaDeFormulariosService.findFormularios(id);
            return res.status(200).json(formularios);
        } catch (err: HttpError | any) {
            return res.status(err.status || 500).json({ error: err.message });
        }
    }
}
