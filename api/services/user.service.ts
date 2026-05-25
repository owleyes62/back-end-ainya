import { prisma } from "../../lib/prisma.js";
import { HttpError } from "../core/httpError.js";
import { del } from "@vercel/blob";
import argon2 from "argon2";
import fs from "node:fs";
import path from "node:path";
import { UserSchema } from "../schemas/user.schema.js";

const isDev = process.env.NODE_ENV === "development";

export class UserService {
    static async create(body: UserSchema) {
        if (!body.name || !body.email || !body.password) {
            throw new HttpError("Name, email and password are required", 400);
        }

        await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                role: body.role,
                password: await argon2.hash(body.password),
                ...(body.institutionId && {
                    institution: {
                        connect: { id: body.institutionId },
                    },
                }),
            },
            include: {
                institution: true,
            },
        });
    }

    static async getAll() {
        return await prisma.user.findMany();
    }

    static async findById(id: string) {
        if (!id) throw new HttpError("id é obrigatório", 400);

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                institution_id: true,
                avatarUrl: true,
                createdAt: true,
                updatedAt: true,
                institution: { select: { id: true, name: true } },
            },
        });

        if (!user) throw new HttpError("Usuário não encontrado", 404);

        return user;
    }

    static async updateProfile(
        id: string,
        body: { name?: string; password?: string }
    ) {
        if (!id) throw new HttpError("id é obrigatório", 400);

        const { name, password } = body;

        if (!name && !password) {
            throw new HttpError("Informe name ou password para atualizar", 400);
        }

        const data: { name?: string; password?: string } = {};

        if (name) {
            if (name.trim().length < 2) {
                throw new HttpError("name deve ter pelo menos 2 caracteres", 400);
            }
            data.name = name;
        }

        if (password) {
            if (password.length < 6) {
                throw new HttpError("password deve ter pelo menos 6 caracteres", 400);
            }
            data.password = await argon2.hash(password);
        }

        const updated = await prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                institution_id: true,
            },
        });

        return updated;
    }

    static async updateAvatar(id: string, newUrl: string) {
        if (!id) throw new HttpError("id é obrigatório", 400);
        if (!newUrl) throw new HttpError("avatarUrl é obrigatório", 400);

        const current = await prisma.user.findUnique({
            where: { id },
            select: { avatarUrl: true },
        });

        if (!current) throw new HttpError("Usuário não encontrado", 404);

        const updated = await prisma.user.update({
            where: { id },
            data: { avatarUrl: newUrl },
            select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
            },
        });

        // Best-effort cleanup do avatar anterior (Blob ou disco).
        // Não derruba o request se falhar.
        if (current.avatarUrl && current.avatarUrl !== newUrl) {
            try {
                if (current.avatarUrl.startsWith("http")) {
                    await del(current.avatarUrl);
                } else if (current.avatarUrl.startsWith("/uploads/")) {
                    const filename = current.avatarUrl.replace("/uploads/", "");
                    const filePath = path.resolve("public/uploads", filename);
                    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                }
            } catch (err) {
                console.error("Falha ao remover avatar anterior:", err);
            }
        }

        return updated;
    }
}
