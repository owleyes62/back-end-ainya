import { prisma } from "../../lib/prisma.js";
import { HttpError } from "../core/httpError.js";
import argon2 from "argon2";
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
}
    