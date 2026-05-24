// Testes unitários do UserService.
// Estratégia: isolar dependências externas com MOCKS e usar STUBS
// (objetos falsos em memória) para simular entradas/retornos.
//
// Dependências mockadas:
//  - prisma (acesso ao banco)
//  - argon2 (hash de senha)
//
// Nenhum teste toca no banco real.

import { UserService } from "./user.service";
import { prisma } from "../../lib/prisma";
import argon2 from "argon2";
import { HttpError } from "../core/httpError";

// MOCK do Prisma Client: substitui métodos por jest.fn()
jest.mock("../../lib/prisma", () => ({
    prisma: {
        user: {
            create: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
        },
    },
}));

// MOCK do argon2: hash e verify viram funções fake
jest.mock("argon2");

const prismaUserMock = prisma.user as jest.Mocked<typeof prisma.user>;
const argon2Mock = argon2 as jest.Mocked<typeof argon2>;

// STUB de usuário usado por vários testes
const userStub = {
    id: "user-id-1",
    name: "João",
    email: "joao@email.com",
    role: "aluno",
    institution_id: "inst-1",
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe("UserService", () => {
    // ──────────────────────────────────────────────
    // create
    // ──────────────────────────────────────────────
    describe("create", () => {
        it("deve criar usuário chamando argon2.hash e prisma.user.create", async () => {
            argon2Mock.hash.mockResolvedValue("hashed_password" as never);
            prismaUserMock.create.mockResolvedValue(userStub as any);

            await UserService.create({
                name: "João",
                email: "joao@email.com",
                password: "123456",
                role: "aluno",
                institutionId: "inst-1",
            });

            // hash chamado com a senha original
            expect(argon2Mock.hash).toHaveBeenCalledWith("123456");
            // prisma.create recebe a senha já hasheada e a institution conectada
            expect(prismaUserMock.create).toHaveBeenCalledWith({
                data: {
                    name: "João",
                    email: "joao@email.com",
                    role: "aluno",
                    password: "hashed_password",
                    institution: { connect: { id: "inst-1" } },
                },
                include: { institution: true },
            });
        });

        it("não deve incluir institution quando institutionId não for informado", async () => {
            argon2Mock.hash.mockResolvedValue("hashed" as never);
            prismaUserMock.create.mockResolvedValue(userStub as any);

            await UserService.create({
                name: "Ana",
                email: "ana@email.com",
                password: "abcdef",
            });

            const payload = prismaUserMock.create.mock.calls[0][0] as any;
            expect(payload.data.institution).toBeUndefined();
            expect(payload.data.email).toBe("ana@email.com");
        });

        it("deve lançar HttpError 400 quando faltar name", async () => {
            await expect(
                UserService.create({ name: "", email: "x@y.com", password: "123" } as any)
            ).rejects.toMatchObject({ status: 400 });

            // garante que nada chegou ao banco
            expect(prismaUserMock.create).not.toHaveBeenCalled();
            expect(argon2Mock.hash).not.toHaveBeenCalled();
        });

        it("deve lançar HttpError 400 quando faltar email", async () => {
            await expect(
                UserService.create({ name: "João", email: "", password: "123" } as any)
            ).rejects.toThrow(HttpError);
            expect(prismaUserMock.create).not.toHaveBeenCalled();
        });

        it("deve lançar HttpError 400 quando faltar password", async () => {
            await expect(
                UserService.create({ name: "João", email: "j@e.com", password: "" } as any)
            ).rejects.toThrow(HttpError);
            expect(prismaUserMock.create).not.toHaveBeenCalled();
        });

        it("deve propagar erro inesperado vindo do Prisma", async () => {
            argon2Mock.hash.mockResolvedValue("hashed" as never);
            prismaUserMock.create.mockRejectedValue(new Error("DB caiu"));

            await expect(
                UserService.create({ name: "x", email: "x@y.com", password: "123456" })
            ).rejects.toThrow("DB caiu");
        });
    });

    // ──────────────────────────────────────────────
    // getAll
    // ──────────────────────────────────────────────
    describe("getAll", () => {
        it("deve retornar a lista de usuários do prisma.findMany", async () => {
            prismaUserMock.findMany.mockResolvedValue([userStub] as any);

            const result = await UserService.getAll();

            expect(result).toEqual([userStub]);
            expect(prismaUserMock.findMany).toHaveBeenCalledTimes(1);
        });
    });

    // ──────────────────────────────────────────────
    // findById
    // ──────────────────────────────────────────────
    describe("findById", () => {
        it("deve retornar usuário quando encontrado", async () => {
            prismaUserMock.findUnique.mockResolvedValue(userStub as any);

            const result = await UserService.findById("user-id-1");

            expect(result).toEqual(userStub);
            expect(prismaUserMock.findUnique).toHaveBeenCalledWith(
                expect.objectContaining({ where: { id: "user-id-1" } })
            );
        });

        it("deve lançar 404 quando usuário não existir", async () => {
            prismaUserMock.findUnique.mockResolvedValue(null);

            await expect(UserService.findById("nao-existe")).rejects.toMatchObject({
                status: 404,
            });
        });

        it("deve lançar 400 quando id estiver vazio", async () => {
            await expect(UserService.findById("")).rejects.toMatchObject({ status: 400 });
            expect(prismaUserMock.findUnique).not.toHaveBeenCalled();
        });
    });

    // ──────────────────────────────────────────────
    // updateProfile
    // ──────────────────────────────────────────────
    describe("updateProfile", () => {
        it("deve atualizar apenas o name quando só name for informado", async () => {
            prismaUserMock.update.mockResolvedValue({ ...userStub, name: "João Silva" } as any);

            const result = await UserService.updateProfile("user-id-1", { name: "João Silva" });

            expect(argon2Mock.hash).not.toHaveBeenCalled();
            expect(prismaUserMock.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { id: "user-id-1" },
                    data: { name: "João Silva" },
                })
            );
            expect(result.name).toBe("João Silva");
        });

        it("deve hashear e atualizar password quando informado", async () => {
            argon2Mock.hash.mockResolvedValue("nova_hashed" as never);
            prismaUserMock.update.mockResolvedValue(userStub as any);

            await UserService.updateProfile("user-id-1", { password: "novaSenha" });

            expect(argon2Mock.hash).toHaveBeenCalledWith("novaSenha");
            expect(prismaUserMock.update).toHaveBeenCalledWith(
                expect.objectContaining({ data: { password: "nova_hashed" } })
            );
        });

        it("deve lançar 400 quando nenhum campo for informado", async () => {
            await expect(
                UserService.updateProfile("user-id-1", {})
            ).rejects.toMatchObject({ status: 400 });
            expect(prismaUserMock.update).not.toHaveBeenCalled();
        });

        it("deve lançar 400 quando name tiver menos de 2 caracteres", async () => {
            await expect(
                UserService.updateProfile("user-id-1", { name: "A" })
            ).rejects.toMatchObject({ status: 400 });
            expect(prismaUserMock.update).not.toHaveBeenCalled();
        });

        it("deve lançar 400 quando password tiver menos de 6 caracteres", async () => {
            await expect(
                UserService.updateProfile("user-id-1", { password: "123" })
            ).rejects.toMatchObject({ status: 400 });
            expect(argon2Mock.hash).not.toHaveBeenCalled();
            expect(prismaUserMock.update).not.toHaveBeenCalled();
        });

        it("deve lançar 400 quando id estiver vazio", async () => {
            await expect(
                UserService.updateProfile("", { name: "João" })
            ).rejects.toMatchObject({ status: 400 });
        });
    });
});
