import { UserController } from "./user.controller";
import { UserService } from "../services/user.service";
import { HttpError } from "../core/httpError";
import { Request, Response } from "express";

jest.mock("../services/user.service");

const serviceMock = UserService as jest.Mocked<typeof UserService>;

const mockRes = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

describe("UserController", () => {
    describe("create", () => {
        it("deve retornar 201 ao criar usuário com sucesso", async () => {
            serviceMock.create.mockResolvedValue(undefined);
            const req = { body: { name: "João", email: "joao@email.com", password: "123456" } } as Request;
            const res = mockRes();

            await UserController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: "created successfully" });
        });
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
    });

    describe("login", () => {
        it("deve retornar 200 ao logar com sucesso", async () => {
            serviceMock.login.mockResolvedValue({
                id: "550e8400-e29b-41d4-a716-446655440000",
                name: "João",
                email: "joao@email.com",
                password: "123456",
                role: "aluno",
                institution_id: null,
                institution: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            const req = { body: { email: "joao@email.com", password: "123456" } } as Request;
            const res = mockRes();

            await UserController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
});