// Testes unitários do ListaDeFormulariosService.
// MOCK do Prisma (listaDeFormularios, formulario) + MOCK do UserCanteiroService.
// STUBS: lista, formulários.

import { ListaDeFormulariosService } from "../listadeformularios.service";
import { prisma } from "../../../lib/prisma";
import { UserCanteiroService } from "../usercanteiro.service";

jest.mock("../../../lib/prisma", () => ({
    prisma: {
        listaDeFormularios: {
            create: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
        },
        formulario: {
            findMany: jest.fn(),
        },
        canteiro: {
            findUnique: jest.fn(),
        },
    },
}));

jest.mock("../usercanteiro.service", () => ({
    UserCanteiroService: {
        exists: jest.fn(),
    },
}));

const listaMock = prisma.listaDeFormularios as jest.Mocked<typeof prisma.listaDeFormularios>;
const formMock = prisma.formulario as jest.Mocked<typeof prisma.formulario>;
const canteiroMock = prisma.canteiro as jest.Mocked<typeof prisma.canteiro>;
const existsMock = UserCanteiroService.exists as jest.Mock;

const listaStub = {
    id: "lista-1",
    canteiro_id: "cant-1",
    plant_id: "p1",
    created_by: "user-1",
    name: "Lista A",
} as any;

beforeEach(() => {
    jest.clearAllMocks();
});

describe("ListaDeFormulariosService", () => {
    describe("create", () => {
        it("deve criar a lista quando o usuário está vinculado ao canteiro (plant_id derivado do canteiro)", async () => {
            existsMock.mockResolvedValue(true);
            canteiroMock.findUnique.mockResolvedValue({ plant_id: "p1" } as any);
            listaMock.create.mockResolvedValue(listaStub);

            const result = await ListaDeFormulariosService.create({
                canteiro_id: "cant-1",
                created_by: "user-1",
                name: "Lista A",
            });

            expect(existsMock).toHaveBeenCalledWith("user-1", "cant-1");
            // service busca o canteiro só para pegar o plant_id
            expect(canteiroMock.findUnique).toHaveBeenCalledWith(
                expect.objectContaining({ where: { id: "cant-1" } })
            );
            expect(listaMock.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: {
                        canteiro_id: "cant-1",
                        plant_id: "p1",
                        created_by: "user-1",
                        name: "Lista A",
                    },
                })
            );
            expect(result).toEqual(listaStub);
        });

        it("deve lançar 400 quando campos obrigatórios ausentes", async () => {
            await expect(
                ListaDeFormulariosService.create({
                    canteiro_id: "",
                    created_by: "u",
                })
            ).rejects.toMatchObject({ status: 400 });
            expect(existsMock).not.toHaveBeenCalled();
        });

        it("deve lançar 400 quando name tiver menos de 2 caracteres", async () => {
            await expect(
                ListaDeFormulariosService.create({
                    canteiro_id: "c",
                    created_by: "u",
                    name: "A",
                })
            ).rejects.toMatchObject({ status: 400 });
        });

        it("deve lançar 403 quando o usuário não está vinculado ao canteiro", async () => {
            existsMock.mockResolvedValue(false);

            await expect(
                ListaDeFormulariosService.create({
                    canteiro_id: "cant-1",
                    created_by: "user-1",
                })
            ).rejects.toMatchObject({ status: 403 });

            expect(listaMock.create).not.toHaveBeenCalled();
            expect(canteiroMock.findUnique).not.toHaveBeenCalled();
        });

        it("deve lançar 404 quando o canteiro não existir", async () => {
            existsMock.mockResolvedValue(true);
            canteiroMock.findUnique.mockResolvedValue(null);

            await expect(
                ListaDeFormulariosService.create({
                    canteiro_id: "fantasma",
                    created_by: "user-1",
                })
            ).rejects.toMatchObject({ status: 404 });

            expect(listaMock.create).not.toHaveBeenCalled();
        });
    });

    describe("findById", () => {
        it("deve retornar a lista com formulários quando existir", async () => {
            listaMock.findUnique.mockResolvedValue(listaStub);

            const result = await ListaDeFormulariosService.findById("lista-1");

            expect(listaMock.findUnique).toHaveBeenCalledWith(
                expect.objectContaining({ where: { id: "lista-1" } })
            );
            expect(result).toEqual(listaStub);
        });

        it("deve lançar 404 quando a lista não existir", async () => {
            listaMock.findUnique.mockResolvedValue(null);

            await expect(
                ListaDeFormulariosService.findById("nope")
            ).rejects.toMatchObject({ status: 404 });
        });
    });

    describe("findByCanteiro", () => {
        it("deve retornar listas do canteiro ordenadas desc", async () => {
            listaMock.findMany.mockResolvedValue([listaStub] as any);

            const result = await ListaDeFormulariosService.findByCanteiro("cant-1");

            expect(listaMock.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { canteiro_id: "cant-1" },
                    orderBy: { createdAt: "desc" },
                })
            );
            expect(result).toEqual([listaStub]);
        });

        it("deve lançar 400 quando canteiroId vazio", async () => {
            await expect(
                ListaDeFormulariosService.findByCanteiro("")
            ).rejects.toMatchObject({ status: 400 });
        });
    });

    describe("findFormularios", () => {
        it("deve retornar formulários da lista ordenados asc", async () => {
            formMock.findMany.mockResolvedValue([] as any);

            await ListaDeFormulariosService.findFormularios("lista-1");

            expect(formMock.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { list_id: "lista-1" },
                    orderBy: { createdAt: "asc" },
                })
            );
        });

        it("deve lançar 400 quando listaId vazio", async () => {
            await expect(
                ListaDeFormulariosService.findFormularios("")
            ).rejects.toMatchObject({ status: 400 });
        });
    });
});
