import { prisma } from "../../lib/prisma.js";
import { HttpError } from "../core/httpError.js";

type FormularioResumo = {
    id: string;
    createdAt: Date;
};


export class AlunoService {
    static async getResumo(userId: string) {
        if (!userId) {
            throw new HttpError("userId é obrigatório", 400);
        }

        const formularios: FormularioResumo[] = await prisma.formulario.findMany({
            where: {
                user_id: userId,
            },
            select: {
                id: true,
                createdAt: true,
            },
        });

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

        const totalRelatorios = await prisma.relatorio.count({
            where: {
                user_id: userId,
            },
        });

        return {
            total_formularios: formularios.length,
            total_semanas: semanas.size,
            total_relatorios: totalRelatorios,
        };
    }
}