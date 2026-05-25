import { prisma } from "../../lib/prisma.js";
import { HttpError } from "../core/httpError.js";

export class AcademicPeriodService {
    static async getActive() {
        const now = new Date();

        const period = await prisma.academicPeriod.findFirst({
            where: {
                start_date: { lte: now },
                end_date: { gte: now },
            },
            orderBy: { start_date: "desc" },
        });

        if (!period) {
            throw new HttpError("Nenhum período letivo ativo encontrado", 404);
        }

        return period;
    }

    static async findAll() {
        return prisma.academicPeriod.findMany({
            orderBy: { start_date: "desc" },
        });
    }
}
