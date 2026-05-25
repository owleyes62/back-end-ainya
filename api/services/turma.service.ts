import { prisma } from "../../lib/prisma.js";
import { HttpError } from "../core/httpError.js";

export class TurmaService {
    static async findById(id: string) {
        if (!id) throw new HttpError("id é obrigatório", 400);

        const turma = await prisma.turma.findUnique({
            where: { id },
            include: {
                institution: { select: { id: true, name: true } },
                period: true,
            },
        });

        if (!turma) throw new HttpError("Turma não encontrada", 404);
        return turma;
    }

    static async findAll() {
        return prisma.turma.findMany({
            include: {
                institution: { select: { id: true, name: true } },
                period: { select: { id: true, name: true, semester: true } },
            },
            orderBy: { createdAt: "desc" },
        });
    }
}
