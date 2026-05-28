import { prisma } from "../../lib/prisma.js";
import { HttpError } from "../core/httpError.js";
import { UserCanteiroService } from "./usercanteiro.service.js";

export class ListaDeFormulariosService {
    static async create(body: {
        canteiro_id: string;
        created_by: string;
        name?: string;
    }) {
        const { canteiro_id, created_by, name } = body;
        if (!canteiro_id || !created_by) {
            throw new HttpError(
                "canteiro_id e created_by são obrigatórios",
                400
            );
        }

        if (name && name.trim().length < 2) {
            throw new HttpError("name deve ter pelo menos 2 caracteres", 400);
        }

        const vinculado = await UserCanteiroService.exists(created_by, canteiro_id);
        if (!vinculado) {
            throw new HttpError(
                "Usuário não está vinculado ao canteiro informado",
                403
            );
        }

        // plant_id deixou de ser do body: derivamos do canteiro para garantir consistência.
        const canteiro = await prisma.canteiro.findUnique({
            where: { id: canteiro_id },
            select: { plant_id: true },
        });
        if (!canteiro) {
            throw new HttpError("Canteiro não encontrado", 404);
        }

        return prisma.listaDeFormularios.create({
            data: {
                canteiro_id,
                plant_id: canteiro.plant_id,
                created_by,
                name,
            },
            include: {
                plant: { select: { id: true, name: true, category: true } },
            },
        });
    }

    static async findById(listaId: string) {
        const lista = await prisma.listaDeFormularios.findUnique({
            where: { id: listaId },
            include: {
                plant: { select: { id: true, name: true, category: true } },
                formularios: {
                    orderBy: { createdAt: "asc" },
                    select: {
                        id: true,
                        type: true,
                        synced: true,
                        started_at: true,
                        ended_at: true,
                        createdAt: true,
                    },
                },
            },
        });
        if (!lista) throw new HttpError("Lista de formulários não encontrada", 404);
        return lista;
    }

    static async findByCanteiro(canteiroId: string) {
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

    static async findFormularios(listaId: string) {
        if (!listaId) throw new HttpError("listaId é obrigatório", 400);

        return prisma.formulario.findMany({
            where: { list_id: listaId },
            orderBy: { createdAt: "asc" },
        });
    }
}
