// Testes unitários do PlantTemplateService.
// MOCK do Prisma (plantTemplate) e STUBS de template.

import { PlantTemplateService } from "../planttemplate.service";
import { prisma } from "../../../lib/prisma";

jest.mock("../../../lib/prisma", () => ({
    prisma: {
        plantTemplate: {
            findMany: jest.fn(),
            create: jest.fn(),
        },
    },
}));

const templateMock = prisma.plantTemplate as jest.Mocked<typeof prisma.plantTemplate>;

const templateStub = {
    id: "tpl-1",
    plant_id: "p1",
    field_name: "Altura",
    unit: "cm",
} as any;

beforeEach(() => {
    jest.clearAllMocks();
});

describe("PlantTemplateService", () => {
    describe("findAllByPlant", () => {
        it("deve retornar templates filtrados por plant_id", async () => {
            templateMock.findMany.mockResolvedValue([templateStub] as any);

            const result = await PlantTemplateService.findAllByPlant("p1");

            expect(templateMock.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ where: { plant_id: "p1" } })
            );
            expect(result).toEqual([templateStub]);
        });

        it("deve lançar 400 quando plant_id vazio", async () => {
            await expect(
                PlantTemplateService.findAllByPlant("")
            ).rejects.toMatchObject({ status: 400 });
        });
    });

    describe("create", () => {
        it("deve criar template com plant_id, field_name e unit", async () => {
            templateMock.create.mockResolvedValue(templateStub);

            const result = await PlantTemplateService.create({
                plant_id: "p1",
                field_name: "Altura",
                unit: "cm",
            });

            expect(templateMock.create).toHaveBeenCalledWith({
                data: { plant_id: "p1", field_name: "Altura", unit: "cm" },
            });
            expect(result).toEqual(templateStub);
        });

        it("deve lançar 400 quando algum campo obrigatório está ausente", async () => {
            await expect(
                PlantTemplateService.create({ plant_id: "", field_name: "x", unit: "y" })
            ).rejects.toMatchObject({ status: 400 });
            await expect(
                PlantTemplateService.create({ plant_id: "p", field_name: "", unit: "y" })
            ).rejects.toMatchObject({ status: 400 });
            await expect(
                PlantTemplateService.create({ plant_id: "p", field_name: "x", unit: "" })
            ).rejects.toMatchObject({ status: 400 });
            expect(templateMock.create).not.toHaveBeenCalled();
        });
    });
});
