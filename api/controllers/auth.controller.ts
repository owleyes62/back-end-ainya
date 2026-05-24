
import { Request, Response } from "express";
import { HttpError } from "../core/httpError.js";
import { AuthService } from "../services/auth.service.js";

export class AuthController {

    static async login(req: Request, res: Response) {
        try {
            const tokens = await AuthService.login(req.body);
            return res.status(200).json(tokens);
        } catch (err: HttpError | any) {
            console.error("Error:", err);
            return res.status(err.status || 500).json({ error: err.message });
        }
    }

    static async refresh(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                throw new HttpError("refreshToken é obrigatório", 400);
            }
            const tokens = await AuthService.refresh(refreshToken);
            return res.status(200).json(tokens);
        } catch (err: HttpError | any) {
            console.error("Error:", err);
            return res.status(err.status || 500).json({ error: err.message });
        }
    }

    static async logout(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                throw new HttpError("refreshToken é obrigatório", 400);
            }
            await AuthService.logout(refreshToken);
            return res.status(200).json({ message: "Logout realizado com sucesso" });
        } catch (err: HttpError | any) {
            console.error("Error:", err);
            return res.status(err.status || 500).json({ error: err.message });
        }
    }
}
