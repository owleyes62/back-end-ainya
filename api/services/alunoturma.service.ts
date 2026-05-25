import { prisma } from "../../lib/prisma.js";
import { HttpError } from "../core/httpError.js";

export class AlunoTurmaService {
    static async create(body: { user_id: string; turma_id: string }) {
        const { user_id, turma_id } = body;

        if (!user_id || !turma_id) {
            throw new HttpError("user_id e turma_id são obrigatórios", 400);
        }

        const user = await prisma.user.findUnique({ where: { id: user_id } });
        if (!user) throw new HttpError("Usuário não encontrado", 404);

        const turma = await prisma.turma.findUnique({ where: { id: turma_id } });
        if (!turma) throw new HttpError("Turma não encontrada", 404);

        const existente = await prisma.alunoTurma.findFirst({
            where: { user_id, turma_id },
        });
        if (existente) {
            throw new HttpError("Aluno já vinculado a essa turma", 409);
        }

        return prisma.alunoTurma.create({
            data: { user_id, turma_id },
        });
    }

    static async findByUser(user_id: string) {
        if (!user_id) throw new HttpError("user_id é obrigatório", 400);

        return prisma.alunoTurma.findMany({
            where: { user_id },
            include: {
                turma: {
                    include: {
                        institution: { select: { id: true, name: true } },
                        period: { select: { id: true, name: true, semester: true } },
                    },
                },
            },
        });
    }
}
