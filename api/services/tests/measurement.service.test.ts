// Testes unitários do MeasurementService.
// MOCK do Prisma (measurement) e STUBS de medições.

import { MeasurementService } from "../measurement.service";
import { prisma } from "../../../lib/prisma";

jest.mock("../../../lib/prisma", () => ({
    prisma: {
        measurement: {
            createMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            findMany: jest.fn(),
        },
    },
}));

const measurementMock = prisma.measurement as jest.Mocked<typeof prisma.measurement>;

const measurementStub = {
    id: "m1",
    form_id: "form-1",
    template_id: "tpl-1",
    value: 0,
} as any;

beforeEach(() => {
    jest.clearAllMocks();
});

describe("MeasurementService", () => {
    describe("createManyForFormulario", () => {
        it("deve criar várias medições aplicando value default = 0", async () => {
            measurementMock.createMany.mockResolvedValue({ count: 2 } as any);

            await MeasurementService.createManyForFormulario("form-1", [
                { template_id: "t1", value: 10 },
                { template_id: "t2" }, // sem value → 0
            ]);

            expect(measurementMock.createMany).toHaveBeenCalledWith({
                data: [
                    { form_id: "form-1", template_id: "t1", value: 10 },
                    { form_id: "form-1", template_id: "t2", value: 0 },
                ],
            });
        });

        it("deve lançar 400 quando form_id vazio", async () => {
            await expect(
                MeasurementService.createManyForFormulario("", [{ template_id: "t1" }])
            ).rejects.toMatchObject({ status: 400 });
        });

        it("deve lançar 400 quando measurements vazio ou não-array", async () => {
            await expect(
                MeasurementService.createManyForFormulario("form-1", [])
            ).rejects.toMatchObject({ status: 400 });
            await expect(
                MeasurementService.createManyForFormulario("form-1", null as any)
            ).rejects.toMatchObject({ status: 400 });
        });
    });

    describe("updateValue", () => {
        it("deve atualizar o value da medição", async () => {
            measurementMock.update.mockResolvedValue({ ...measurementStub, value: 42 });

            const result = await MeasurementService.updateValue("m1", 42);

            expect(measurementMock.update).toHaveBeenCalledWith({
                where: { id: "m1" },
                data: { value: 42 },
            });
            expect(result.value).toBe(42);
        });

        it("deve lançar 400 quando id vazio", async () => {
            await expect(
                MeasurementService.updateValue("", 1)
            ).rejects.toMatchObject({ status: 400 });
        });

        it("deve lançar 400 quando value não for number", async () => {
            await expect(
                MeasurementService.updateValue("m1", "10" as any)
            ).rejects.toMatchObject({ status: 400 });
        });
    });

    describe("findByFormulario", () => {
        it("deve retornar medições com template", async () => {
            measurementMock.findMany.mockResolvedValue([measurementStub] as any);

            const result = await MeasurementService.findByFormulario("form-1");

            expect(measurementMock.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ where: { form_id: "form-1" } })
            );
            expect(result).toEqual([measurementStub]);
        });

        it("deve lançar 400 quando form_id vazio", async () => {
            await expect(
                MeasurementService.findByFormulario("")
            ).rejects.toMatchObject({ status: 400 });
        });
    });

    describe("create", () => {
        it("deve criar medição com value padrão 0", async () => {
            measurementMock.create.mockResolvedValue(measurementStub);

            await MeasurementService.create({
                form_id: "form-1",
                template_id: "tpl-1",
            });

            expect(measurementMock.create).toHaveBeenCalledWith({
                data: { form_id: "form-1", template_id: "tpl-1", value: 0 },
            });
        });

        it("deve respeitar value explícito", async () => {
            measurementMock.create.mockResolvedValue({ ...measurementStub, value: 99 });

            await MeasurementService.create({
                form_id: "form-1",
                template_id: "tpl-1",
                value: 99,
            });

            expect(measurementMock.create).toHaveBeenCalledWith({
                data: { form_id: "form-1", template_id: "tpl-1", value: 99 },
            });
        });

        it("deve lançar 400 quando form_id ou template_id ausentes", async () => {
            await expect(
                MeasurementService.create({ form_id: "", template_id: "t" })
            ).rejects.toMatchObject({ status: 400 });
            await expect(
                MeasurementService.create({ form_id: "f", template_id: "" })
            ).rejects.toMatchObject({ status: 400 });
        });
    });
});
