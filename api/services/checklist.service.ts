import { prisma } from "../../lib/prisma.js";
import { HttpError } from "../core/httpError.js";

export class ChecklistService {
    static async createManyForFormulario(form_id: string, template_ids: string[]) {
        if (!form_id) {
            throw new HttpError("form_id é obrigatório", 400);
        }

        if (!template_ids || !Array.isArray(template_ids) || template_ids.length === 0) {
            throw new HttpError("template_ids deve ser uma lista com pelo menos um item", 400);
        }

        const checklistItems = await prisma.checklist.createMany({
            data: template_ids.map((template_id: string) => ({
                form_id,
                template_id,
                checked: false,
            })),
        });

        return checklistItems;
    }

    static async updateChecked(id: string, checked: boolean) {
        if (!id) {
            throw new HttpError("id é obrigatório", 400);
        }

        if (typeof checked !== "boolean") {
            throw new HttpError("checked deve ser boolean", 400);
        }

        const checklist = await prisma.checklist.update({
            where: {
                id,
            },
            data: {
                checked,
            },
        });

        return checklist;
    }

    static async create(body: any) {
        const { form_id, template_id, checked } = body;

        if (!form_id || !template_id) {
            throw new HttpError("form_id e template_id são obrigatórios", 400);
        }

        const checklist = await prisma.checklist.create({
            data: {
                form_id,
                template_id,
                checked: checked ?? false,
            },
        });

        return checklist;
    }
}