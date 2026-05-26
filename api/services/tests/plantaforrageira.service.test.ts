// Testes unitários do PlantaForrageiraService.
// MOCK do Prisma (plantaForrageira) e STUBS de planta.

import { PlantaForrageiraService } from "../plantaforrageira.service";
import { prisma } from "../../../lib/prisma";

jest.mock("../../../lib/prisma", () => ({
    prisma: {
        plantaForrageira: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
        },
    },
}));

const plantaMock = prisma.plantaForrageira as jest.Mocked<typeof prisma.plantaForrageira>;

const plantaStub = {
    id: "p1",
    name: "Capim Elefante",
    category: "GRAMINEA_PORTE_ALTO",
    description: "Alto rendimento",
    semester_focus: 1,
} as any;

beforeEach(() => {
    jest.clearAllMocks();
});

describe("PlantaForrageiraService", () => {
    describe("findAll", () => {
        it("deve retornar todas as plantas quando nenhuma categoria é informada", async () => {
            plantaMock.findMany.mockResolvedValue([plantaStub] as any);

            const result = await PlantaForrageiraService.findAll();

            expect(plantaMock.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: {},
                    orderBy: { name: "asc" },
                })
            );
            expect(result).toEqual([plantaStub]);
        });

        it("deve filtrar por categoria válida", async () => {
            plantaMock.findMany.mockResolvedValue([plantaStub] as any);

            await PlantaForrageiraService.findAll("CACTACEA");

            expect(plantaMock.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ where: { category: "CACTACEA" } })
            );
        });

        it("deve lançar 400 quando categoria inválida", async () => {
            await expect(
                PlantaForrageiraService.findAll("CATEGORIA_INVENTADA")
            ).rejects.toMatchObject({ status: 400 });
            expect(plantaMock.findMany).not.toHaveBeenCalled();
        });
    });

    describe("findById", () => {
        it("deve retornar a planta quando existir", async () => {
            plantaMock.findUnique.mockResolvedValue(plantaStub);

            const result = await PlantaForrageiraService.findById("p1");

            expect(plantaMock.findUnique).toHaveBeenCalledWith({ where: { id: "p1" } });
            expect(result).toEqual(plantaStub);
        });

        it("deve lançar 404 quando não encontrada", async () => {
            plantaMock.findUnique.mockResolvedValue(null);

            await expect(
                PlantaForrageiraService.findById("nope")
            ).rejects.toMatchObject({ status: 404 });
        });

        it("deve lançar 400 quando id vazio", async () => {
            await expect(PlantaForrageiraService.findById("")).rejects.toMatchObject({
                status: 400,
            });
        });
    });
});
