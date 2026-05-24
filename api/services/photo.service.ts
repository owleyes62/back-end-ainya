import { prisma } from "../../lib/prisma.js";
import { HttpError } from "../core/httpError.js";
import fs from "node:fs";
import path from "node:path";

export class PhotoService {
    static async create(body: { form_id: string; url: string }) {
        const { form_id, url } = body;

        if (!form_id || !url) {
            throw new HttpError("form_id e url são obrigatórios", 400);
        }

        const photo = await prisma.photo.create({
            data: {
                form_id,
                url,
            },
        });

        return photo;
    }

    static async findByFormulario(form_id: string) {
        if (!form_id) {
            throw new HttpError("form_id é obrigatório", 400);
        }

        return prisma.photo.findMany({
            where: { form_id },
            orderBy: { takenAt: "desc" },
        });
    }

    static async delete(id: string) {
        if (!id) {
            throw new HttpError("id é obrigatório", 400);
        }

        const photo = await prisma.photo.findUnique({
            where: {
                id,
            },
        });

        if (!photo) {
            throw new HttpError("Foto não encontrada", 404);
        }

        await prisma.photo.delete({
            where: {
                id,
            },
        });

        if (photo.url.startsWith("/uploads/")) {
            const filename = photo.url.replace("/uploads/", "");
            const filePath = path.resolve("public/uploads", filename);

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        return photo;
    }
}