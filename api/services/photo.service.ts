import { prisma } from "../../lib/prisma.js";
import { HttpError } from "../core/httpError.js";

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
}