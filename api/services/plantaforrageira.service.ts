import { prisma } from "../../lib/prisma.js";
import { HttpError } from "../core/httpError.js";

const CATEGORIAS_VALIDAS = [
    "CACTACEA",
    "CULTURA_ANUAL",
    "GRAMINEA_PORTE_ALTO",
    "GRAMINEA_PORTE_BAIXO",
    "GRAMINEA_PORTE_MEDIO",
    "LEGUMINOSA_ARBUSTIVA",
    "LEGUMINOSA_HERBACEA",
    "OLEAGINOSA_FORRAGEIRA",
];

export class PlantaForrageiraService {
    static async findAll(category?: string) {
        if (category && !CATEGORIAS_VALIDAS.includes(category)) {
            throw new HttpError(
                `Categoria inválida. Use: ${CATEGORIAS_VALIDAS.join(", ")}`,
                400
            );
        }

        const where = category ? { category } : {};

        return prisma.plantaForrageira.findMany({
            where,
            orderBy: { name: "asc" },
            select: {
                id: true,
                name: true,
                category: true,
                description: true,
                semester_focus: true,
            },
        });
    }

    static async findById(id: string) {
        if (!id) throw new HttpError("id é obrigatório", 400);

        const planta = await prisma.plantaForrageira.findUnique({
            where: { id },
        });

        if (!planta) throw new HttpError("Planta forrageira não encontrada", 404);

        return planta;
    }
}
