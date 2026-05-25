import { prisma } from "../../lib/prisma.js";
import { HttpError } from "../core/httpError.js";

type FormularioResumo = {
    id: string;
    createdAt: Date;
};

function calcularSemanasUnicas(formularios: FormularioResumo[]): number {
    const semanas = new Set(
        formularios.map((formulario) => {
            const createdAt = new Date(formulario.createdAt);
            const year = createdAt.getFullYear();

            const startOfYear = new Date(year, 0, 1);
            const diffInMs = createdAt.getTime() - startOfYear.getTime();
            const diffInDays = Math.floor(diffInMs / 86400000);

            const week = Math.ceil(
                (diffInDays + startOfYear.getDay() + 1) / 7
            );

            return `${year}-${week}`;
        })
    );

    return semanas.size;
}

export class AlunoService {
    static async getResumo(userId: string) {
        if (!userId) {
            throw new HttpError("userId é obrigatório", 400);
        }

        const formularios: FormularioResumo[] = await prisma.formulario.findMany({
            where: { user_id: userId },
            select: { id: true, createdAt: true },
        });

        const totalRelatorios = await prisma.relatorio.count({
            where: { user_id: userId },
        });

        return {
            total_formularios: formularios.length,
            total_semanas: calcularSemanasUnicas(formularios),
            total_relatorios: totalRelatorios,
        };
    }

    static async getHome(userId: string) {
        if (!userId) {
            throw new HttpError("userId é obrigatório", 400);
        }

        const formulariosRecentes = await prisma.formulario.findMany({
            where: { user_id: userId },
            orderBy: { createdAt: "desc" },
            take: 5,
            select: {
                id: true,
                type: true,
                synced: true,
                started_at: true,
                ended_at: true,
                createdAt: true,
                list: {
                    include: {
                        plant: {
                            select: { id: true, name: true, category: true },
                        },
                    },
                },
            },
        });

        const todosFormularios: FormularioResumo[] = await prisma.formulario.findMany({
            where: { user_id: userId },
            select: { id: true, createdAt: true },
        });

        const vinculos = await prisma.userCanteiro.findMany({
            where: { user_id: userId },
            include: {
                canteiro: {
                    include: {
                        plant: {
                            select: { id: true, name: true, category: true },
                        },
                        _count: {
                            select: { listaDeFormularios: true },
                        },
                    },
                },
            },
        });

        const canteiros = vinculos.map((v) => v.canteiro);
        const canteiroIds = canteiros.map((c) => c.id);

        const totalListas = await prisma.listaDeFormularios.count({
            where: { canteiro_id: { in: canteiroIds } },
        });

        const totalRelatorios = await prisma.relatorio.count({
            where: { user_id: userId },
        });

        return {
            formularios_recentes: formulariosRecentes,
            canteiros,
            total_listas: totalListas,
            total_formularios: todosFormularios.length,
            total_semanas: calcularSemanasUnicas(todosFormularios),
            total_relatorios: totalRelatorios,
        };
    }
}
