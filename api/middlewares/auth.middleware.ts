import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HttpError } from "../core/httpError.js";

export interface AuthRequest extends Request {
    user?: { id: string };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith("Bearer ")) {
            throw new HttpError("Token não enviado", 401);
        }

        const token = header.slice("Bearer ".length).trim();
        if (!token) {
            throw new HttpError("Token vazio", 401);
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string };
        req.user = { id: payload.sub };
        return next();
    } catch (err: HttpError | any) {
        const status = err.status ?? 401;
        const message = err.message ?? "Token inválido";
        return res.status(status).json({ error: message });
    }
}
