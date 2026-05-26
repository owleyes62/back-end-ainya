// Testes unitários do AcademicPeriodService.
// Estratégia: MOCK do Prisma (academicPeriod) e STUBS de período.
// Nenhum teste toca no banco real.

import { AcademicPeriodService } from "../academicperiod.service";
import { prisma } from "../../../lib/prisma";

jest.mock("../../../lib/prisma", () => ({
    prisma: {
        academicPeriod: {
            findFirst: jest.fn(),
            findMany: jest.fn(),
        },
    },
}));

const prismaPeriodMock = prisma.academicPeriod as jest.Mocked<typeof prisma.academicPeriod>;

const periodStub = {
    id: "period-1",
    name: "2026.1",
    semester: 1,
    start_date: new Date("2026-02-01"),
    end_date: new Date("2026-06-30"),
} as any;

beforeEach(() => {
    jest.clearAllMocks();
});

describe("AcademicPeriodService", () => {
    describe("getActive", () => {
        it("deve retornar o período ativo quando existir", async () => {
            prismaPeriodMock.findFirst.mockResolvedValue(periodStub);

            const result = await AcademicPeriodService.getActive();

            expect(prismaPeriodMock.findFirst).toHaveBeenCalledTimes(1);
            expect(result).toEqual(periodStub);
        });

        it("deve filtrar por start_date <= hoje e end_date >= hoje", async () => {
            prismaPeriodMock.findFirst.mockResolvedValue(periodStub);

            await AcademicPeriodService.getActive();

            const arg = prismaPeriodMock.findFirst.mock.calls[0][0] as any;
            expect(arg.where.start_date).toHaveProperty("lte");
            expect(arg.where.end_date).toHaveProperty("gte");
            expect(arg.orderBy).toEqual({ start_date: "desc" });
        });

        it("deve lançar 404 quando não houver período ativo", async () => {
            prismaPeriodMock.findFirst.mockResolvedValue(null);

            await expect(AcademicPeriodService.getActive()).rejects.toMatchObject({
                status: 404,
            });
        });
    });

    describe("findAll", () => {
        it("deve retornar todos os períodos ordenados desc", async () => {
            prismaPeriodMock.findMany.mockResolvedValue([periodStub] as any);

            const result = await AcademicPeriodService.findAll();

            expect(result).toEqual([periodStub]);
            expect(prismaPeriodMock.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ orderBy: { start_date: "desc" } })
            );
        });
    });
});
