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

    static async login(body: any) {
        const { email, password } = body;

        if (!email || !password) {
            throw new HttpError("Email and password are required", 400);
        }

        const user = await prisma.user.findUnique({
            where: {
                email,
            },
            include: {
                institution: true,
            },
        });

        if (!user) {
            if (isDev) {
                throw new HttpError("User not found", 404);
            } else {
                throw new HttpError("Invalid credentials", 401);
            }
        }

        const ok = await argon2.verify(user.password, password)

        if (!ok) {
            if(isDev) {
                throw new HttpError("Invalid password", 401);
            } else {
                throw new HttpError("Invalid credentials", 401);
            }
        }

        return user;
    }

    static async getAll() {
        return await prisma.user.findMany();
    }
}
    