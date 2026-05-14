import { prisma } from "../../lib/prisma.js";
import { HttpError } from "../core/httpError.js";

export class FormularioService {
    static async findAllByUser(user_id: string) {
        if (!user_id) {
            throw new HttpError("user_id is required", 400);
        }

        const formularios = await prisma.formulario.findMany({
            where: {
                user_id,
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                list: {
                    include: {
                        plant: true,
                    },
                },
            },
        });

        return formularios;
    }

    static async create(body: any) {
        const { list_id, user_id, type, observations } = body;

        if (!list_id || !user_id || !type) {
            throw new HttpError("list_id, user_id and type are required", 400);
        }

        const formulario = await prisma.formulario.create({
            data: {
                list_id,
                user_id,
                type,
                started_at: new Date(),
                ended_at: new Date(),
                observations: observations || "",
                synced: false,
            },
        });

        return formulario;
    }
}