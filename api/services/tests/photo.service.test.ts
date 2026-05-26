// Testes unitários do PhotoService.
// MOCK do Prisma (photo), do @vercel/blob (del), e do node:fs.
// STUBS de fotos com url http e url /uploads/.

import { PhotoService } from "../photo.service";
import { prisma } from "../../../lib/prisma";
import { del } from "@vercel/blob";
import fs from "node:fs";

jest.mock("../../../lib/prisma", () => ({
    prisma: {
        photo: {
            create: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
            delete: jest.fn(),
        },
    },
}));

jest.mock("@vercel/blob", () => ({
    del: jest.fn(),
}));

jest.mock("node:fs", () => ({
    existsSync: jest.fn(),
    unlinkSync: jest.fn(),
}));

const photoMock = prisma.photo as jest.Mocked<typeof prisma.photo>;
const delMock = del as jest.Mock;
const fsMock = fs as jest.Mocked<typeof fs>;

const photoStubHttp = {
    id: "ph-1",
    form_id: "form-1",
    url: "https://xyz.public.blob.vercel-storage.com/photos/a.jpg",
} as any;

const photoStubLocal = {
    id: "ph-2",
    form_id: "form-1",
    url: "/uploads/local.jpg",
} as any;

beforeEach(() => {
    jest.clearAllMocks();
});

describe("PhotoService", () => {
    describe("create", () => {
        it("deve criar foto com form_id e url", async () => {
            photoMock.create.mockResolvedValue(photoStubHttp);

            const result = await PhotoService.create({
                form_id: "form-1",
                url: photoStubHttp.url,
            });

            expect(photoMock.create).toHaveBeenCalledWith({
                data: { form_id: "form-1", url: photoStubHttp.url },
            });
            expect(result).toEqual(photoStubHttp);
        });

        it("deve lançar 400 quando form_id ou url ausentes", async () => {
            await expect(
                PhotoService.create({ form_id: "", url: "x" })
            ).rejects.toMatchObject({ status: 400 });
            await expect(
                PhotoService.create({ form_id: "f", url: "" })
            ).rejects.toMatchObject({ status: 400 });
        });
    });

    describe("findByFormulario", () => {
        it("deve retornar fotos ordenadas por takenAt desc", async () => {
            photoMock.findMany.mockResolvedValue([photoStubHttp] as any);

            await PhotoService.findByFormulario("form-1");

            expect(photoMock.findMany).toHaveBeenCalledWith({
                where: { form_id: "form-1" },
                orderBy: { takenAt: "desc" },
            });
        });

        it("deve lançar 400 quando form_id vazio", async () => {
            await expect(
                PhotoService.findByFormulario("")
            ).rejects.toMatchObject({ status: 400 });
        });
    });

    describe("delete", () => {
        it("deve deletar registro e chamar del() para URL http", async () => {
            photoMock.findUnique.mockResolvedValue(photoStubHttp);
            photoMock.delete.mockResolvedValue(photoStubHttp);
            delMock.mockResolvedValue(undefined);

            const result = await PhotoService.delete("ph-1");

            expect(photoMock.delete).toHaveBeenCalledWith({ where: { id: "ph-1" } });
            expect(delMock).toHaveBeenCalledWith(photoStubHttp.url);
            expect(result).toEqual(photoStubHttp);
        });

        it("deve deletar arquivo local quando url começa com /uploads/", async () => {
            photoMock.findUnique.mockResolvedValue(photoStubLocal);
            photoMock.delete.mockResolvedValue(photoStubLocal);
            fsMock.existsSync.mockReturnValue(true);

            await PhotoService.delete("ph-2");

            expect(fsMock.existsSync).toHaveBeenCalled();
            expect(fsMock.unlinkSync).toHaveBeenCalled();
            expect(delMock).not.toHaveBeenCalled();
        });

        it("não deve tentar unlink se o arquivo local não existir", async () => {
            photoMock.findUnique.mockResolvedValue(photoStubLocal);
            photoMock.delete.mockResolvedValue(photoStubLocal);
            fsMock.existsSync.mockReturnValue(false);

            await PhotoService.delete("ph-2");

            expect(fsMock.unlinkSync).not.toHaveBeenCalled();
        });

        it("não deve quebrar se del() falhar", async () => {
            photoMock.findUnique.mockResolvedValue(photoStubHttp);
            photoMock.delete.mockResolvedValue(photoStubHttp);
            delMock.mockRejectedValue(new Error("Blob fora do ar"));

            await expect(PhotoService.delete("ph-1")).resolves.toEqual(photoStubHttp);
        });

        it("deve lançar 404 quando foto não existir", async () => {
            photoMock.findUnique.mockResolvedValue(null);

            await expect(PhotoService.delete("nope")).rejects.toMatchObject({
                status: 404,
            });
            expect(photoMock.delete).not.toHaveBeenCalled();
        });

        it("deve lançar 400 quando id vazio", async () => {
            await expect(PhotoService.delete("")).rejects.toMatchObject({
                status: 400,
            });
        });
    });
});
