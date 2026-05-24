// Testes unitários do UserController.
// Estratégia: MOCK do UserService (jest.mock) e STUBS de Request/Response
// (objetos falsos em memória). O controller é testado em isolamento total
// do service e do banco.

import { UserController } from "./user.controller.js";
import { UserService } from "../services/user.service.js";
import { HttpError } from "../core/httpError.js";
import { Request, Response } from "express";

// MOCK do service inteiro: cada método vira jest.fn()
jest.mock("../services/user.service");

const serviceMock = UserService as jest.Mocked<typeof UserService>;

// STUB de Response: status e json encadeáveis e inspecionáveis
const mockRes = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe("UserController", () => {
    // ──────────────────────────────────────────────
    // create
    // ──────────────────────────────────────────────
    describe("create", () => {
        it("deve retornar 201 ao criar usuário com sucesso", async () => {
            serviceMock.create.mockResolvedValue(undefined);
            const req = {
                body: { name: "João", email: "joao@email.com", password: "123456" },
            } as Request;
            const res = mockRes();

            await UserController.create(req, res);

            // service chamado com o body recebido
            expect(serviceMock.create).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: "created successfully" });
        });

        it("deve retornar o status do HttpError em caso de falha", async () => {
            serviceMock.create.mockRejectedValue(new HttpError("Email já existe", 409));

            const req = { body: {} } as Request;
            const res = mockRes();

            await UserController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({ error: "Email já existe" });
        });

        it("deve retornar 500 para erros inesperados", async () => {
            serviceMock.create.mockRejectedValue(new Error("Erro de banco"));

            const req = { body: {} } as Request;
            const res = mockRes();

            await UserController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Erro de banco" });
        });
    });

    // ──────────────────────────────────────────────
    // getAll
    // ──────────────────────────────────────────────
    describe("getAll", () => {
        it("deve retornar 200 com a lista de usuários", async () => {
            const lista = [{ id: "u1", name: "João" }] as any;
            serviceMock.getAll.mockResolvedValue(lista);

            const req = {} as Request;
            const res = mockRes();

            await UserController.getAll(req, res);

            expect(serviceMock.getAll).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(lista);
        });

        it("deve propagar status do HttpError em falha", async () => {
            serviceMock.getAll.mockRejectedValue(new HttpError("Sem acesso", 403));

            const res = mockRes();
            await UserController.getAll({} as Request, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ error: "Sem acesso" });
        });
    });

    // ──────────────────────────────────────────────
    // findById
    // ──────────────────────────────────────────────
    describe("findById", () => {
        it("deve retornar 200 com o usuário encontrado", async () => {
            const user = { id: "user-1", name: "João" } as any;
            serviceMock.findById.mockResolvedValue(user);

            const req = { params: { id: "user-1" } } as unknown as Request;
            const res = mockRes();

            await UserController.findById(req, res);

            expect(serviceMock.findById).toHaveBeenCalledWith("user-1");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(user);
        });

        it("deve retornar 404 quando service lança HttpError 404", async () => {
            serviceMock.findById.mockRejectedValue(new HttpError("Usuário não encontrado", 404));

            const req = { params: { id: "x" } } as unknown as Request;
            const res = mockRes();

            await UserController.findById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Usuário não encontrado" });
        });
    });

    // ──────────────────────────────────────────────
    // updateProfile
    // ──────────────────────────────────────────────
    describe("updateProfile", () => {
        it("deve retornar 200 com o usuário atualizado", async () => {
            const atualizado = { id: "user-1", name: "Novo Nome" } as any;
            serviceMock.updateProfile.mockResolvedValue(atualizado);

            const req = {
                params: { id: "user-1" },
                body: { name: "Novo Nome" },
            } as unknown as Request;
            const res = mockRes();

            await UserController.updateProfile(req, res);

            expect(serviceMock.updateProfile).toHaveBeenCalledWith("user-1", { name: "Novo Nome" });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(atualizado);
        });

        it("deve retornar 400 quando o service rejeita por validação", async () => {
            serviceMock.updateProfile.mockRejectedValue(
                new HttpError("name deve ter pelo menos 2 caracteres", 400)
            );

            const req = {
                params: { id: "user-1" },
                body: { name: "A" },
            } as unknown as Request;
            const res = mockRes();

            await UserController.updateProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "name deve ter pelo menos 2 caracteres",
            });
        });
    });
});
