// Testes unitários do InstitutionService.
// MOCK do Prisma (institution) e STUBS de instituição.

import { InstitutionService } from "../institution.service";
import { prisma } from "../../../lib/prisma";

jest.mock("../../../lib/prisma", () => ({
    prisma: {
        institution: {
            create: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
        },
    },
}));

const institutionMock = prisma.institution as jest.Mocked<typeof prisma.institution>;

const institutionStub = { id: "inst-1", name: "UNICAP" } as any;

beforeEach(() => {
    jest.clearAllMocks();
});

describe("InstitutionService", () => {
    describe("create", () => {
        it("deve criar instituição e retornar via findUnique", async () => {
            institutionMock.create.mockResolvedValue(institutionStub);
            institutionMock.findUnique.mockResolvedValue(institutionStub);

            const result = await InstitutionService.create({ name: "UNICAP" });

            expect(institutionMock.create).toHaveBeenCalledWith({
                data: { name: "UNICAP" },
            });
            expect(institutionMock.findUnique).toHaveBeenCalledWith({
                where: { id: "inst-1" },
            });
            expect(result).toEqual(institutionStub);
        });

        it("deve lançar 400 quando name estiver ausente", async () => {
            await expect(
                InstitutionService.create({})
            ).rejects.toMatchObject({ status: 400 });

            expect(institutionMock.create).not.toHaveBeenCalled();
        });
    });

    describe("getAll", () => {
        it("deve retornar todas as instituições", async () => {
            institutionMock.findMany.mockResolvedValue([institutionStub] as any);

            const result = await InstitutionService.getAll();

            expect(institutionMock.findMany).toHaveBeenCalledTimes(1);
            expect(result).toEqual([institutionStub]);
        });
    });
});
