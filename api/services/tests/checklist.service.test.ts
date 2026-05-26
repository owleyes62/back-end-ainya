// Testes unitários do ChecklistService.
// MOCK do Prisma (checklist) e STUBS de itens.

import { ChecklistService } from "../checklist.service";
import { prisma } from "../../../lib/prisma";

jest.mock("../../../lib/prisma", () => ({
    prisma: {
        checklist: {
            createMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            findMany: jest.fn(),
        },
    },
}));

const checklistMock = prisma.checklist as jest.Mocked<typeof prisma.checklist>;

const itemStub = {
    id: "chk-1",
    form_id: "form-1",
    template_id: "tpl-1",
    checked: false,
} as any;

beforeEach(() => {
    jest.clearAllMocks();
});

describe("ChecklistService", () => {
    describe("createManyForFormulario", () => {
        it("deve criar vários itens de checklist a partir dos template_ids", async () => {
            checklistMock.createMany.mockResolvedValue({ count: 2 } as any);

            const result = await ChecklistService.createManyForFormulario("form-1", [
                "tpl-1",
                "tpl-2",
            ]);

            expect(checklistMock.createMany).toHaveBeenCalledWith({
                data: [
                    { form_id: "form-1", template_id: "tpl-1", checked: false },
                    { form_id: "form-1", template_id: "tpl-2", checked: false },
                ],
            });
            expect(result).toEqual({ count: 2 });
        });

        it("deve lançar 400 quando form_id estiver ausente", async () => {
            await expect(
                ChecklistService.createManyForFormulario("", ["tpl-1"])
            ).rejects.toMatchObject({ status: 400 });
        });

        it("deve lançar 400 quando template_ids estiver vazio", async () => {
            await expect(
                ChecklistService.createManyForFormulario("form-1", [])
            ).rejects.toMatchObject({ status: 400 });
        });

        it("deve lançar 400 quando template_ids não for array", async () => {
            await expect(
                ChecklistService.createManyForFormulario("form-1", null as any)
            ).rejects.toMatchObject({ status: 400 });
        });
    });

    describe("updateChecked", () => {
        it("deve atualizar checked para true", async () => {
            checklistMock.update.mockResolvedValue({ ...itemStub, checked: true });

            const result = await ChecklistService.updateChecked("chk-1", true);

            expect(checklistMock.update).toHaveBeenCalledWith({
                where: { id: "chk-1" },
                data: { checked: true },
            });
            expect(result.checked).toBe(true);
        });

        it("deve lançar 400 quando id estiver vazio", async () => {
            await expect(
                ChecklistService.updateChecked("", true)
            ).rejects.toMatchObject({ status: 400 });
        });

        it("deve lançar 400 quando checked não for boolean", async () => {
            await expect(
                ChecklistService.updateChecked("chk-1", "true" as any)
            ).rejects.toMatchObject({ status: 400 });
        });
    });

    describe("findByFormulario", () => {
        it("deve retornar checklist com template incluso", async () => {
            checklistMock.findMany.mockResolvedValue([itemStub] as any);

            const result = await ChecklistService.findByFormulario("form-1");

            expect(checklistMock.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ where: { form_id: "form-1" } })
            );
            expect(result).toEqual([itemStub]);
        });

        it("deve lançar 400 quando form_id estiver vazio", async () => {
            await expect(
                ChecklistService.findByFormulario("")
            ).rejects.toMatchObject({ status: 400 });
        });
    });

    describe("create", () => {
        it("deve criar item de checklist com checked default = false", async () => {
            checklistMock.create.mockResolvedValue(itemStub);

            const result = await ChecklistService.create({
                form_id: "form-1",
                template_id: "tpl-1",
            });

            expect(checklistMock.create).toHaveBeenCalledWith({
                data: { form_id: "form-1", template_id: "tpl-1", checked: false },
            });
            expect(result).toEqual(itemStub);
        });

        it("deve respeitar checked explícito quando informado", async () => {
            checklistMock.create.mockResolvedValue({ ...itemStub, checked: true });

            await ChecklistService.create({
                form_id: "form-1",
                template_id: "tpl-1",
                checked: true,
            });

            expect(checklistMock.create).toHaveBeenCalledWith({
                data: { form_id: "form-1", template_id: "tpl-1", checked: true },
            });
        });

        it("deve lançar 400 quando form_id ou template_id ausentes", async () => {
            await expect(
                ChecklistService.create({ form_id: "", template_id: "tpl-1" })
            ).rejects.toMatchObject({ status: 400 });
            await expect(
                ChecklistService.create({ form_id: "form-1", template_id: "" })
            ).rejects.toMatchObject({ status: 400 });
        });
    });
});
