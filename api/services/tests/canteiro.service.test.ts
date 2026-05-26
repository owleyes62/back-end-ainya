// Testes unitários do CanteiroService.
// MOCK do Prisma (userCanteiro, canteiro, listaDeFormularios) e STUBS.

import { CanteiroService } from "../canteiro.service";
import { prisma } from "../../../lib/prisma";

jest.mock("../../../lib/prisma", () => ({
    prisma: {
        userCanteiro: { findMany: jest.fn(), create: jest.fn() },
        canteiro: { create: jest.fn() },
        listaDeFormularios: { findMany: jest.fn() },
    },
}));

const userCanteiroMock = prisma.userCanteiro as jest.Mocked<typeof prisma.userCanteiro>;
const canteiroMock = prisma.canteiro as jest.Mocked<typeof prisma.canteiro>;
const listaMock = prisma.listaDeFormularios as jest.Mocked<typeof prisma.listaDeFormularios>;

const vinculoStub = {
    canteiro: {
        id: "cant-1",
        name: "Canteiro A",
        plant: { id: "p1", name: "Capim" },
        listaDeFormularios: [],
    },
} as any;

const canteiroCriadoStub = { id: "cant-novo", plant_id: "p1", name: "Novo" } as any;

beforeEach(() => {
    jest.clearAllMocks();
});

describe("CanteiroService", () => {
    describe("findByUser", () => {
        it("deve retornar a lista de canteiros do usuário", async () => {
            userCanteiroMock.findMany.mockResolvedValue([vinculoStub] as any);

            const result = await CanteiroService.findByUser("user-1");

            expect(userCanteiroMock.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ where: { user_id: "user-1" } })
            );
            expect(result).toEqual([vinculoStub.canteiro]);
        });

        it("deve lançar 400 quando userId estiver vazio", async () => {
            await expect(CanteiroService.findByUser("")).rejects.toMatchObject({
                status: 400,
            });
        });
    });

    describe("create", () => {
        it("deve criar canteiro e vínculo quando user_id for informado", async () => {
            canteiroMock.create.mockResolvedValue(canteiroCriadoStub);
            userCanteiroMock.create.mockResolvedValue({} as any);

            const result = await CanteiroService.create({
                plant_id: "p1",
                name: "Novo",
                user_id: "user-1",
            });

            expect(canteiroMock.create).toHaveBeenCalledWith({
                data: { plant_id: "p1", name: "Novo" },
            });
            expect(userCanteiroMock.create).toHaveBeenCalledWith({
                data: { user_id: "user-1", canteiro_id: "cant-novo" },
            });
            expect(result).toEqual(canteiroCriadoStub);
        });

        it("não deve criar vínculo quando user_id não for informado", async () => {
            canteiroMock.create.mockResolvedValue(canteiroCriadoStub);

            await CanteiroService.create({ plant_id: "p1", name: "Novo" });

            expect(canteiroMock.create).toHaveBeenCalled();
            expect(userCanteiroMock.create).not.toHaveBeenCalled();
        });

        it("deve lançar 400 quando plant_id ou name estiverem ausentes", async () => {
            await expect(
                CanteiroService.create({ plant_id: "", name: "X" })
            ).rejects.toMatchObject({ status: 400 });
            await expect(
                CanteiroService.create({ plant_id: "p1", name: "" })
            ).rejects.toMatchObject({ status: 400 });
            expect(canteiroMock.create).not.toHaveBeenCalled();
        });
    });

    describe("findListasByCanteiro", () => {
        it("deve retornar as listas do canteiro ordenadas desc", async () => {
            const listas = [{ id: "l1" }] as any;
            listaMock.findMany.mockResolvedValue(listas);

            const result = await CanteiroService.findListasByCanteiro("cant-1");

            expect(listaMock.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { canteiro_id: "cant-1" },
                    orderBy: { createdAt: "desc" },
                })
            );
            expect(result).toEqual(listas);
        });

        it("deve lançar 400 quando canteiroId estiver vazio", async () => {
            await expect(
                CanteiroService.findListasByCanteiro("")
            ).rejects.toMatchObject({ status: 400 });
        });
    });
});
