import { Request, Response } from "express";
import { HttpError } from "../core/httpError.js";
import { UserCanteiroService } from "../services/usercanteiro.service.js";

export class UserCanteiroController {
    static async create(req: Request, res: Response) {
        try {
            // user_id sempre vem do JWT (requireAuth) — body não controla mais.
            const vinculo = await UserCanteiroService.create({
                ...req.body,
                user_id: req.user!.id,
            });
            return res.status(201).json(vinculo);
        } catch (err: HttpError | any) {
            return res.status(err.status || 500).json({ error: err.message });
        }
    }

    static async findByUser(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const vinculos = await UserCanteiroService.findByUser(userId);
            return res.status(200).json(vinculos);
        } catch (err: HttpError | any) {
            return res.status(err.status || 500).json({ error: err.message });
        }
    }

    static async findByCanteiro(req: Request, res: Response) {
        try {
            const { canteiroId } = req.params;
            const vinculos = await UserCanteiroService.findByCanteiro(canteiroId);
            return res.status(200).json(vinculos);
        } catch (err: HttpError | any) {
            return res.status(err.status || 500).json({ error: err.message });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            // Usuário só pode remover o próprio vínculo.
            await UserCanteiroService.delete({
                ...req.body,
                user_id: req.user!.id,
            });
            return res.status(200).json({ message: "Vínculo removido com sucesso" });
        } catch (err: HttpError | any) {
            return res.status(err.status || 500).json({ error: err.message });
        }
    }
}
