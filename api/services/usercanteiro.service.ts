import { prisma } from "../../lib/prisma.js";
import { HttpError } from "../core/httpError.js";

export class UserCanteiroService {
    static async create(body: { user_id: string; canteiro_id: string }) {
        const { user_id, canteiro_id } = body;

        if (!user_id || !canteiro_id) {
            throw new HttpError("user_id e canteiro_id são obrigatórios", 400);
        }

        const user = await prisma.user.findUnique({ where: { id: user_id } });
        if (!user) throw new HttpError("Usuário não encontrado", 404);

        const canteiro = await prisma.canteiro.findUnique({
            where: { id: canteiro_id },
        });
        if (!canteiro) throw new HttpError("Canteiro não encontrado", 404);

        const existente = await prisma.userCanteiro.findUnique({
            where: { user_id_canteiro_id: { user_id, canteiro_id } },
        });
        if (existente) {
            throw new HttpError("Vínculo já existe", 409);
        }

        return prisma.userCanteiro.create({
            data: { user_id, canteiro_id },
        });
    }

    static async findByUser(user_id: string) {
        if (!user_id) throw new HttpError("user_id é obrigatório", 400);

        return prisma.userCanteiro.findMany({
            where: { user_id },
            include: {
                canteiro: {
                    include: {
                        plant: {
                            select: { id: true, name: true, category: true },
                        },
                    },
                },
            },
        });
    }

    static async findByCanteiro(canteiro_id: string) {
        if (!canteiro_id) throw new HttpError("canteiro_id é obrigatório", 400);

        return prisma.userCanteiro.findMany({
            where: { canteiro_id },
            include: {
                user: {
                    select: { id: true, name: true, email: true, role: true },
                },
            },
        });
    }

    static async delete(body: { user_id: string; canteiro_id: string }) {
        const { user_id, canteiro_id } = body;

        if (!user_id || !canteiro_id) {
            throw new HttpError("user_id e canteiro_id são obrigatórios", 400);
        }

        const vinculo = await prisma.userCanteiro.findUnique({
            where: { user_id_canteiro_id: { user_id, canteiro_id } },
        });
        if (!vinculo) {
            throw new HttpError("Vínculo não encontrado", 404);
        }

        return prisma.userCanteiro.delete({
            where: { user_id_canteiro_id: { user_id, canteiro_id } },
        });
    }

    static async exists(user_id: string, canteiro_id: string) {
        const vinculo = await prisma.userCanteiro.findUnique({
            where: { user_id_canteiro_id: { user_id, canteiro_id } },
        });
        return Boolean(vinculo);
    }
}
