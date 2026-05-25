import { prisma } from "../../lib/prisma.js";
import { HttpError } from "../core/httpError.js";

export class CanteiroService {
    static async findByUser(userId: string) {
        if (!userId) throw new HttpError("userId é obrigatório", 400);

        const vinculos = await prisma.userCanteiro.findMany({
            where: { user_id: userId },
            include: {
                canteiro: {
                    include: {
                        plant: {
                            select: { id: true, name: true, category: true },
                        },
                        listaDeFormularios: {
                            include: {
                                plant: {
                                    select: { id: true, name: true },
                                },
                                _count: {
                                    select: { formularios: true },
                                },
                            },
                        },
                    },
                },
            },
        });

        return vinculos.map((v) => v.canteiro);
    }

    static async create(body: { plant_id: string; name: string; user_id?: string }) {
        const { plant_id, name, user_id } = body;
        if (!plant_id || !name) {
            throw new HttpError("plant_id e name são obrigatórios", 400);
        }

        const canteiro = await prisma.canteiro.create({
            data: { plant_id, name },
        });

        if (user_id) {
            await prisma.userCanteiro.create({
                data: { user_id, canteiro_id: canteiro.id },
            });
        }

        return canteiro;
    }

    static async findListasByCanteiro(canteiroId: string) {
        if (!canteiroId) throw new HttpError("canteiroId é obrigatório", 400);

        return prisma.listaDeFormularios.findMany({
            where: { canteiro_id: canteiroId },
            include: {
                plant: { select: { id: true, name: true, category: true } },
                _count: { select: { formularios: true } },
            },
            orderBy: { createdAt: "desc" },
        });
    }
}
