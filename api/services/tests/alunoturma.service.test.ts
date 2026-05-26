// Testes unitários do AlunoTurmaService.
// MOCK do Prisma (user, turma, alunoTurma) e STUBS de objetos relacionais.

import { AlunoTurmaService } from "../alunoturma.service";
import { prisma } from "../../../lib/prisma";

jest.mock("../../../lib/prisma", () => ({
    prisma: {
        user: { findUnique: jest.fn() },
        turma: { findUnique: jest.fn() },
        alunoTurma: {
            findFirst: jest.fn(),
            create: jest.fn(),
            findMany: jest.fn(),
        },
    },
}));

const userMock = prisma.user as jest.Mocked<typeof prisma.user>;
const turmaMock = prisma.turma as jest.Mocked<typeof prisma.turma>;
const alunoTurmaMock = prisma.alunoTurma as jest.Mocked<typeof prisma.alunoTurma>;

const userStub = { id: "user-1", name: "João" } as any;
const turmaStub = { id: "turma-1", name: "Agronomia A" } as any;
const vinculoStub = { id: "at-1", user_id: "user-1", turma_id: "turma-1" } as any;

beforeEach(() => {
    jest.clearAllMocks();
});

describe("AlunoTurmaService", () => {
    describe("create", () => {
        it("deve criar vínculo quando user e turma existem e ainda não estão vinculados", async () => {
            userMock.findUnique.mockResolvedValue(userStub);
            turmaMock.findUnique.mockResolvedValue(turmaStub);
            alunoTurmaMock.findFirst.mockResolvedValue(null);
            alunoTurmaMock.create.mockResolvedValue(vinculoStub);

            const result = await AlunoTurmaService.create({
                user_id: "user-1",
                turma_id: "turma-1",
            });

            expect(alunoTurmaMock.create).toHaveBeenCalledWith({
                data: { user_id: "user-1", turma_id: "turma-1" },
            });
            expect(result).toEqual(vinculoStub);
        });

        it("deve lançar 400 quando user_id estiver ausente", async () => {
            await expect(
                AlunoTurmaService.create({ user_id: "", turma_id: "turma-1" })
            ).rejects.toMatchObject({ status: 400 });
            expect(userMock.findUnique).not.toHaveBeenCalled();
        });

        it("deve lançar 400 quando turma_id estiver ausente", async () => {
            await expect(
                AlunoTurmaService.create({ user_id: "user-1", turma_id: "" })
            ).rejects.toMatchObject({ status: 400 });
        });

        it("deve lançar 404 quando o usuário não existir", async () => {
            userMock.findUnique.mockResolvedValue(null);

            await expect(
                AlunoTurmaService.create({ user_id: "naoexiste", turma_id: "turma-1" })
            ).rejects.toMatchObject({ status: 404 });

            expect(turmaMock.findUnique).not.toHaveBeenCalled();
            expect(alunoTurmaMock.create).not.toHaveBeenCalled();
        });

        it("deve lançar 404 quando a turma não existir", async () => {
            userMock.findUnique.mockResolvedValue(userStub);
            turmaMock.findUnique.mockResolvedValue(null);

            await expect(
                AlunoTurmaService.create({ user_id: "user-1", turma_id: "naoexiste" })
            ).rejects.toMatchObject({ status: 404 });

            expect(alunoTurmaMock.create).not.toHaveBeenCalled();
        });

        it("deve lançar 409 quando o aluno já estiver vinculado à turma", async () => {
            userMock.findUnique.mockResolvedValue(userStub);
            turmaMock.findUnique.mockResolvedValue(turmaStub);
            alunoTurmaMock.findFirst.mockResolvedValue(vinculoStub);

            await expect(
                AlunoTurmaService.create({ user_id: "user-1", turma_id: "turma-1" })
            ).rejects.toMatchObject({ status: 409 });

            expect(alunoTurmaMock.create).not.toHaveBeenCalled();
        });
    });

    describe("findByUser", () => {
        it("deve retornar os vínculos do usuário com turma/institution/period", async () => {
            alunoTurmaMock.findMany.mockResolvedValue([vinculoStub] as any);

            const result = await AlunoTurmaService.findByUser("user-1");

            expect(alunoTurmaMock.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { user_id: "user-1" },
                })
            );
            expect(result).toEqual([vinculoStub]);
        });

        it("deve lançar 400 quando user_id estiver vazio", async () => {
            await expect(AlunoTurmaService.findByUser("")).rejects.toMatchObject({
                status: 400,
            });
        });
    });
});
