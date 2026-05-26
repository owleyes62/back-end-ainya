// Testes unitários do UserCanteiroService.
// MOCK do Prisma (user, canteiro, userCanteiro) e STUBS dos objetos.

import { UserCanteiroService } from "../usercanteiro.service";
import { prisma } from "../../../lib/prisma";

jest.mock("../../../lib/prisma", () => ({
    prisma: {
        user: { findUnique: jest.fn() },
        canteiro: { findUnique: jest.fn() },
        userCanteiro: {
            findUnique: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
        },
    },
}));

const userMock = prisma.user as jest.Mocked<typeof prisma.user>;
const canteiroMock = prisma.canteiro as jest.Mocked<typeof prisma.canteiro>;
const ucMock = prisma.userCanteiro as jest.Mocked<typeof prisma.userCanteiro>;

const userStub = { id: "user-1", name: "João" } as any;
const canteiroStub = { id: "cant-1", name: "Canteiro A" } as any;
const vinculoStub = { id: "uc-1", user_id: "user-1", canteiro_id: "cant-1" } as any;

beforeEach(() => {
    jest.clearAllMocks();
});

describe("UserCanteiroService", () => {
    describe("create", () => {
        it("deve criar vínculo quando user e canteiro existem e ainda não vinculados", async () => {
            userMock.findUnique.mockResolvedValue(userStub);
            canteiroMock.findUnique.mockResolvedValue(canteiroStub);
            ucMock.findUnique.mockResolvedValue(null);
            ucMock.create.mockResolvedValue(vinculoStub);

            const result = await UserCanteiroService.create({
                user_id: "user-1",
                canteiro_id: "cant-1",
            });

            expect(ucMock.create).toHaveBeenCalledWith({
                data: { user_id: "user-1", canteiro_id: "cant-1" },
            });
            expect(result).toEqual(vinculoStub);
        });

        it("deve lançar 400 quando campos obrigatórios ausentes", async () => {
            await expect(
                UserCanteiroService.create({ user_id: "", canteiro_id: "c" })
            ).rejects.toMatchObject({ status: 400 });
            await expect(
                UserCanteiroService.create({ user_id: "u", canteiro_id: "" })
            ).rejects.toMatchObject({ status: 400 });
        });

        it("deve lançar 404 quando user não existir", async () => {
            userMock.findUnique.mockResolvedValue(null);

            await expect(
                UserCanteiroService.create({ user_id: "x", canteiro_id: "c" })
            ).rejects.toMatchObject({ status: 404 });

            expect(canteiroMock.findUnique).not.toHaveBeenCalled();
        });

        it("deve lançar 404 quando canteiro não existir", async () => {
            userMock.findUnique.mockResolvedValue(userStub);
            canteiroMock.findUnique.mockResolvedValue(null);

            await expect(
                UserCanteiroService.create({ user_id: "u", canteiro_id: "x" })
            ).rejects.toMatchObject({ status: 404 });

            expect(ucMock.create).not.toHaveBeenCalled();
        });

        it("deve lançar 409 quando vínculo já existe", async () => {
            userMock.findUnique.mockResolvedValue(userStub);
            canteiroMock.findUnique.mockResolvedValue(canteiroStub);
            ucMock.findUnique.mockResolvedValue(vinculoStub);

            await expect(
                UserCanteiroService.create({ user_id: "user-1", canteiro_id: "cant-1" })
            ).rejects.toMatchObject({ status: 409 });

            expect(ucMock.create).not.toHaveBeenCalled();
        });
    });

    describe("findByUser", () => {
        it("deve retornar vínculos com canteiro/plant incluídos", async () => {
            ucMock.findMany.mockResolvedValue([vinculoStub] as any);

            const result = await UserCanteiroService.findByUser("user-1");

            expect(ucMock.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ where: { user_id: "user-1" } })
            );
            expect(result).toEqual([vinculoStub]);
        });

        it("deve lançar 400 quando user_id vazio", async () => {
            await expect(
                UserCanteiroService.findByUser("")
            ).rejects.toMatchObject({ status: 400 });
        });
    });

    describe("findByCanteiro", () => {
        it("deve retornar vínculos com user incluído", async () => {
            ucMock.findMany.mockResolvedValue([vinculoStub] as any);

            const result = await UserCanteiroService.findByCanteiro("cant-1");

            expect(ucMock.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ where: { canteiro_id: "cant-1" } })
            );
            expect(result).toEqual([vinculoStub]);
        });

        it("deve lançar 400 quando canteiro_id vazio", async () => {
            await expect(
                UserCanteiroService.findByCanteiro("")
            ).rejects.toMatchObject({ status: 400 });
        });
    });

    describe("delete", () => {
        it("deve deletar vínculo quando existir", async () => {
            ucMock.findUnique.mockResolvedValue(vinculoStub);
            ucMock.delete.mockResolvedValue(vinculoStub);

            const result = await UserCanteiroService.delete({
                user_id: "user-1",
                canteiro_id: "cant-1",
            });

            expect(ucMock.delete).toHaveBeenCalledWith({
                where: { user_id_canteiro_id: { user_id: "user-1", canteiro_id: "cant-1" } },
            });
            expect(result).toEqual(vinculoStub);
        });

        it("deve lançar 400 quando campos obrigatórios ausentes", async () => {
            await expect(
                UserCanteiroService.delete({ user_id: "", canteiro_id: "c" })
            ).rejects.toMatchObject({ status: 400 });
            await expect(
                UserCanteiroService.delete({ user_id: "u", canteiro_id: "" })
            ).rejects.toMatchObject({ status: 400 });
        });

        it("deve lançar 404 quando vínculo não existir", async () => {
            ucMock.findUnique.mockResolvedValue(null);

            await expect(
                UserCanteiroService.delete({ user_id: "u", canteiro_id: "c" })
            ).rejects.toMatchObject({ status: 404 });
            expect(ucMock.delete).not.toHaveBeenCalled();
        });
    });

    describe("exists", () => {
        it("deve retornar true quando vínculo existe", async () => {
            ucMock.findUnique.mockResolvedValue(vinculoStub);

            const result = await UserCanteiroService.exists("user-1", "cant-1");

            expect(result).toBe(true);
        });

        it("deve retornar false quando vínculo não existe", async () => {
            ucMock.findUnique.mockResolvedValue(null);

            const result = await UserCanteiroService.exists("user-x", "cant-x");

            expect(result).toBe(false);
        });
    });
});
