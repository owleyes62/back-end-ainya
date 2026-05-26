// Testes unitários do TurmaService.
// MOCK do Prisma (turma) e STUBS de turma.

import { TurmaService } from "../turma.service";
import { prisma } from "../../../lib/prisma";

jest.mock("../../../lib/prisma", () => ({
    prisma: {
        turma: {
            findUnique: jest.fn(),
            findMany: jest.fn(),
        },
    },
}));

const turmaMock = prisma.turma as jest.Mocked<typeof prisma.turma>;

const turmaStub = {
    id: "turma-1",
    name: "Agronomia A",
    institution: { id: "inst-1", name: "UNICAP" },
    period: { id: "per-1", name: "2026.1", semester: 1 },
} as any;

beforeEach(() => {
    jest.clearAllMocks();
});

describe("TurmaService", () => {
    describe("findById", () => {
        it("deve retornar a turma quando existir", async () => {
            turmaMock.findUnique.mockResolvedValue(turmaStub);

            const result = await TurmaService.findById("turma-1");

            expect(turmaMock.findUnique).toHaveBeenCalledWith(
                expect.objectContaining({ where: { id: "turma-1" } })
            );
            expect(result).toEqual(turmaStub);
        });

        it("deve lançar 404 quando não encontrada", async () => {
            turmaMock.findUnique.mockResolvedValue(null);

            await expect(TurmaService.findById("nope")).rejects.toMatchObject({
                status: 404,
            });
        });

        it("deve lançar 400 quando id vazio", async () => {
            await expect(TurmaService.findById("")).rejects.toMatchObject({
                status: 400,
            });
        });
    });

    describe("findAll", () => {
        it("deve retornar todas as turmas ordenadas desc", async () => {
            turmaMock.findMany.mockResolvedValue([turmaStub] as any);

            const result = await TurmaService.findAll();

            expect(turmaMock.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ orderBy: { createdAt: "desc" } })
            );
            expect(result).toEqual([turmaStub]);
        });
    });
});
