import { prisma } from "../../lib/prisma.js";
import { HttpError } from "../core/httpError.js";

export class MeasurementService {
    static async createManyForFormulario(
        form_id: string,
        measurements: { template_id: string; value?: number }[]
    ) {
        if (!form_id) {
            throw new HttpError("form_id é obrigatório", 400);
        }

        if (!measurements || !Array.isArray(measurements) || measurements.length === 0) {
            throw new HttpError("measurements deve ser uma lista com pelo menos um item", 400);
        }

        const measurementItems = await prisma.measurement.createMany({
            data: measurements.map((measurement) => ({
                form_id,
                template_id: measurement.template_id,
                value: measurement.value ?? 0,
            })),
        });

        return measurementItems;
    }

    static async updateValue(id: string, value: number) {
        if (!id) {
            throw new HttpError("id é obrigatório", 400);
        }

        if (typeof value !== "number") {
            throw new HttpError("value deve ser um número", 400);
        }

        const measurement = await prisma.measurement.update({
            where: {
                id,
            },
            data: {
                value,
            },
        });

        return measurement;
    }

    static async findByFormulario(form_id: string) {
        if (!form_id) {
            throw new HttpError("form_id é obrigatório", 400);
        }

        return prisma.measurement.findMany({
            where: { form_id },
            include: {
                template: {
                    select: { id: true, field_name: true, unit: true },
                },
            },
        });
    }

    static async create(body: any) {
        const { form_id, template_id, value } = body;

        if (!form_id || !template_id) {
            throw new HttpError("form_id e template_id são obrigatórios", 400);
        }

        const measurement = await prisma.measurement.create({
            data: {
                form_id,
                template_id,
                value: value ?? 0,
            },
        });

        return measurement;
    }
}