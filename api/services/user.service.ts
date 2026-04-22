
import { prisma } from "../../lib/prisma";
import { HttpError } from "../core/httpError";

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
                password,
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
            throw new HttpError("User not found", 404);
        }

        if (user.password !== password) {
            throw new HttpError("Invalid password", 401);
        }

        return user;
    }
}
    