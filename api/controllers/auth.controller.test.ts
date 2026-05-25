// Testes unitários do AuthController.
// Estratégia: MOCK do AuthService e STUBS de Request/Response.
// Cobre login, refresh e logout sem tocar em banco, argon2 ou jwt.

import { AuthController } from "./auth.controller.js";
import { AuthService } from "../services/auth.service.js";
import { HttpError } from "../core/httpError.js";
import { Request, Response } from "express";

jest.mock("../services/auth.service");

const serviceMock = AuthService as jest.Mocked<typeof AuthService>;

// STUB de Response: status/json encadeáveis
const mockRes = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe("AuthController", () => {
    // ──────────────────────────────────────────────
    // login
    // ──────────────────────────────────────────────
    describe("login", () => {
        it("deve retornar 200 com tokens em login válido", async () => {
            const tokensStub = { accessToken: "AT", refreshToken: "RT" };
            serviceMock.login.mockResolvedValue(tokensStub as any);

            const req = {
                body: { email: "joao@email.com", password: "123456" },
            } as Request;
            const res = mockRes();

            await AuthController.login(req, res);

            expect(serviceMock.login).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(tokensStub);
        });

        it("deve retornar status do HttpError em credenciais inválidas", async () => {
            serviceMock.login.mockRejectedValue(new HttpError("Invalid credentials", 401));

            const req = { body: { email: "x@y.com", password: "errada" } } as Request;
            const res = mockRes();

            await AuthController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
        });

        it("deve retornar 500 para erros inesperados", async () => {
            serviceMock.login.mockRejectedValue(new Error("Falha no Prisma"));

            const req = { body: {} } as Request;
            const res = mockRes();

            await AuthController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Falha no Prisma" });
        });
    });

    // ──────────────────────────────────────────────
    // refresh
    // ──────────────────────────────────────────────
    describe("refresh", () => {
        it("deve retornar 200 com novo par de tokens", async () => {
            const tokensStub = { accessToken: "AT2", refreshToken: "RT2" };
            serviceMock.refresh.mockResolvedValue(tokensStub as any);

            const req = { body: { refreshToken: "antigo" } } as Request;
            const res = mockRes();

            await AuthController.refresh(req, res);

            expect(serviceMock.refresh).toHaveBeenCalledWith("antigo");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(tokensStub);
        });

        it("deve retornar 400 quando refreshToken não for enviado", async () => {
            const req = { body: {} } as Request;
            const res = mockRes();

            await AuthController.refresh(req, res);

            // service não deve ser chamado
            expect(serviceMock.refresh).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "refreshToken é obrigatório" });
        });

        it("deve retornar 401 quando service rejeita refresh inválido", async () => {
            serviceMock.refresh.mockRejectedValue(
                new HttpError("Invalid or expired refresh token", 401)
            );

            const req = { body: { refreshToken: "invalido" } } as Request;
            const res = mockRes();

            await AuthController.refresh(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                error: "Invalid or expired refresh token",
            });
        });
    });

    // ──────────────────────────────────────────────
    // logout
    // ──────────────────────────────────────────────
    describe("logout", () => {
        it("deve retornar 200 com mensagem de sucesso", async () => {
            serviceMock.logout.mockResolvedValue(undefined);

            const req = { body: { refreshToken: "abc" } } as Request;
            const res = mockRes();

            await AuthController.logout(req, res);

            expect(serviceMock.logout).toHaveBeenCalledWith("abc");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Logout realizado com sucesso",
            });
        });

        it("deve retornar 400 quando refreshToken não for enviado", async () => {
            const req = { body: {} } as Request;
            const res = mockRes();

            await AuthController.logout(req, res);

            expect(serviceMock.logout).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "refreshToken é obrigatório",
            });
        });

        it("deve retornar 500 em erro inesperado do service", async () => {
            serviceMock.logout.mockRejectedValue(new Error("Falha no banco"));

            const req = { body: { refreshToken: "abc" } } as Request;
            const res = mockRes();

            await AuthController.logout(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Falha no banco" });
        });
    });
});
