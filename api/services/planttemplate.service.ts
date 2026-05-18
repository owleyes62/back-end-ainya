import { prisma } from "../../lib/prisma.js";
import { HttpError } from "../core/httpError.js";

export class PlantTemplateService {
    static async findAllByPlant(plant_id: string) {
        if (!plant_id) {
            throw new HttpError("plant_id é obrigatório", 400);
        }

        const templates = await prisma.plantTemplate.findMany({
            where: {
                plant_id,
            },
            include: {
                planta_forrageira: {
                    select: {
                        id: true,
                        name: true,
                        category: true,
                    },
                },
            },
        });

        return templates;
    }

    static async create(body: any) {
        const { plant_id, field_name, unit } = body;

        if (!plant_id || !field_name || !unit) {
            throw new HttpError("plant_id, field_name e unit são obrigatórios", 400);
        }

        const template = await prisma.plantTemplate.create({
            data: {
                plant_id,
                field_name,
                unit,
            },
        });

        return template;
    }
}