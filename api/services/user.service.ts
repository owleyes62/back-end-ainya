import { prisma } from "../../lib/prisma";
import { HttpError } from "../core/httpError";
import argon2 from "argon2";

const isDev = process.env.NODE_ENV === "development";

export class UserService {
    static async create(body: any) {
        const { name, email, password } = body;

        if (!name || !email || !password) {
            throw new HttpError("Name, email, and password are required", 400);
        }

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: await argon2.hash(password),
            },
            include: {
                institution: true,
            },
        })
    }

    static async getAll() {
        return await prisma.user.findMany();
    }
}
    