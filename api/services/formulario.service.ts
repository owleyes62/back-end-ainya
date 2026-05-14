import { prisma } from "../../lib/prisma.js";
import { HttpError } from "../core/httpError.js";

export class FormularioService {
    static async findAllByUser(user_id: string) {
        if (!user_id) {
            throw new HttpError("user_id is required", 400);
        }

        const formularios = await prisma.formulario.findMany({
            where: {
                user_id,
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                list: {
                    include: {
                        plant: true,
                    },
                },
            },
        });

        return formularios;
    }

    static async create(body: any) {
        const { list_id, user_id, type, observations } = body;

        if (!list_id || !user_id || !type) {
            throw new HttpError("list_id, user_id and type are required", 400);
        }

        const formulario = await prisma.formulario.create({
            data: {
                list_id,
                user_id,
                type,
                started_at: new Date(),
                ended_at: new Date(),
                observations: observations || "",
                synced: false,
            },
        });

        return formulario;
    }

    static async finalizar(id: string) {
    if (!id) {
        throw new HttpError("id é obrigatório", 400);
    }

    const formulario = await prisma.formulario.update({
        where: {
            id,
        },
        data: {
            ended_at: new Date(),
            synced: true,
        },
    });

    return formulario;
}

    static async sync(id: string, body: any) {
        if (!id) {
            throw new HttpError("id é obrigatório", 400);
        }

        const { formulario, checklist, measurements, photos } = body;

        const result = await prisma.$transaction(async (tx) => {
            const updatedFormulario = await tx.formulario.update({
                where: {
                    id,
                },
                data: {
                    type: formulario?.type,
                    observations: formulario?.observations,
                    started_at: formulario?.started_at
                        ? new Date(formulario.started_at)
                        : undefined,
                    ended_at: formulario?.ended_at
                        ? new Date(formulario.ended_at)
                        : new Date(),
                    synced: true,
                },
            });

            if (Array.isArray(checklist) && checklist.length > 0) {
                await tx.checklist.createMany({
                    data: checklist.map((item: { template_id: string; checked?: boolean }) => ({
                        form_id: id,
                        template_id: item.template_id,
                        checked: item.checked ?? false,
                    })),
                    skipDuplicates: true,
                });
            }

            if (Array.isArray(measurements) && measurements.length > 0) {
                await tx.measurement.createMany({
                    data: measurements.map((item: { template_id: string; value?: number }) => ({
                        form_id: id,
                        template_id: item.template_id,
                        value: item.value ?? 0,
                    })),
                    skipDuplicates: true,
                });
            }

            if (Array.isArray(photos) && photos.length > 0) {
                await tx.photo.createMany({
                    data: photos.map((item: { url: string }) => ({
                        form_id: id,
                        url: item.url,
                    })),
                });
            }

            return updatedFormulario;
        });

        return result;
    }
}