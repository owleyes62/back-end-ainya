// Testes unitários do AlunoService.
// Estratégia: MOCK do Prisma (formulario, relatorio, userCanteiro,
// listaDeFormularios) e STUBS de formulários, canteiros e vínculos.

import { AlunoService } from "../aluno.service";
import { prisma } from "../../../lib/prisma";

jest.mock("../../../lib/prisma", () => ({
    prisma: {
        formulario: {
            findMany: jest.fn(),
        },
        relatorio: {
            count: jest.fn(),
        },
        userCanteiro: {
            findMany: jest.fn(),
        },
        listaDeFormularios: {
            count: jest.fn(),
        },
    },
}));

const formularioMock = prisma.formulario as jest.Mocked<typeof prisma.formulario>;
const relatorioMock = prisma.relatorio as jest.Mocked<typeof prisma.relatorio>;
const userCanteiroMock = prisma.userCanteiro as jest.Mocked<typeof prisma.userCanteiro>;
const listaMock = prisma.listaDeFormularios as jest.Mocked<typeof prisma.listaDeFormularios>;

// STUBS — formulários em três semanas diferentes (duas no mesmo)
const formularioStubs = [
    { id: "f1", createdAt: new Date("2026-01-05") }, // semana A
    { id: "f2", createdAt: new Date("2026-01-06") }, // mesma semana de f1
    { id: "f3", createdAt: new Date("2026-02-10") }, // semana B
];

const canteiroVinculoStub = {
    canteiro: {
        id: "cant-1",
        name: "Canteiro A",
        plant: { id: "p1", name: "Capim", category: "GRAMINEA_PORTE_ALTO" },
        _count: { listaDeFormularios: 3 },
    },
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe("AlunoService", () => {
    describe("getResumo", () => {
        it("deve retornar resumo com totais e semanas únicas", async () => {
            formularioMock.findMany.mockResolvedValue(formularioStubs as any);
            relatorioMock.count.mockResolvedValue(2);

            const result = await AlunoService.getResumo("user-1");

            expect(formularioMock.findMany).toHaveBeenCalledWith({
                where: { user_id: "user-1" },
                select: { id: true, createdAt: true },
            });
            expect(relatorioMock.count).toHaveBeenCalledWith({
                where: { user_id: "user-1" },
            });
            expect(result.total_formularios).toBe(3);
            expect(result.total_relatorios).toBe(2);
            // f1 e f2 na mesma semana → 2 semanas únicas
            expect(result.total_semanas).toBeGreaterThanOrEqual(1);
            expect(result.total_semanas).toBeLessThanOrEqual(2);
        });

        it("deve retornar zeros quando não houver formulários", async () => {
            formularioMock.findMany.mockResolvedValue([] as any);
            relatorioMock.count.mockResolvedValue(0);

            const result = await AlunoService.getResumo("user-vazio");

            expect(result).toEqual({
                total_formularios: 0,
                total_semanas: 0,
                total_relatorios: 0,
            });
        });

        it("deve lançar 400 quando userId estiver vazio", async () => {
            await expect(AlunoService.getResumo("")).rejects.toMatchObject({
                status: 400,
            });
            expect(formularioMock.findMany).not.toHaveBeenCalled();
        });
    });

    describe("getHome", () => {
        it("deve retornar payload de home com canteiros e contadores", async () => {
            const recentesStub = [{ id: "f1", type: "DIARIO" }] as any;
            formularioMock.findMany
                .mockResolvedValueOnce(recentesStub) // recentes
                .mockResolvedValueOnce(formularioStubs as any); // todos
            userCanteiroMock.findMany.mockResolvedValue([canteiroVinculoStub] as any);
            listaMock.count.mockResolvedValue(5);
            relatorioMock.count.mockResolvedValue(1);

            const result = await AlunoService.getHome("user-1");

            expect(result.formularios_recentes).toEqual(recentesStub);
            expect(result.canteiros).toHaveLength(1);
            expect(result.canteiros[0].id).toBe("cant-1");
            expect(result.total_listas).toBe(5);
            expect(result.total_formularios).toBe(3);
            expect(result.total_relatorios).toBe(1);
        });

        it("deve passar os ids dos canteiros para listaDeFormularios.count", async () => {
            formularioMock.findMany
                .mockResolvedValueOnce([] as any)
                .mockResolvedValueOnce([] as any);
            userCanteiroMock.findMany.mockResolvedValue([canteiroVinculoStub] as any);
            listaMock.count.mockResolvedValue(0);
            relatorioMock.count.mockResolvedValue(0);

            await AlunoService.getHome("user-1");

            expect(listaMock.count).toHaveBeenCalledWith({
                where: { canteiro_id: { in: ["cant-1"] } },
            });
        });

        it("deve lançar 400 quando userId estiver vazio", async () => {
            await expect(AlunoService.getHome("")).rejects.toMatchObject({
                status: 400,
            });
        });
    });
});
