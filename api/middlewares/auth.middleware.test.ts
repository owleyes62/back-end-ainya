// Testes unitários do requireAuth middleware.
// MOCK do jsonwebtoken e STUBS de Request/Response/next.

process.env.JWT_SECRET = "test-secret";

import jwt from "jsonwebtoken";
import { requireAuth, AuthRequest } from "./auth.middleware";
import { Response, NextFunction } from "express";

jest.mock("jsonwebtoken");

const jwtMock = jwt as jest.Mocked<typeof jwt>;

const mockRes = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockReq = (headers: Record<string, string> = {}): AuthRequest =>
    ({ headers } as unknown as AuthRequest);

beforeEach(() => {
    jest.clearAllMocks();
});

describe("requireAuth", () => {
    it("deve chamar next() e popular req.user quando token é válido", () => {
        (jwtMock.verify as unknown as jest.Mock).mockReturnValue({ sub: "user-1" });

        const req = mockReq({ authorization: "Bearer abc.def.ghi" });
        const res = mockRes();
        const next: NextFunction = jest.fn();

        requireAuth(req, res, next);

        expect(jwtMock.verify).toHaveBeenCalledWith("abc.def.ghi", "test-secret");
        expect(req.user).toEqual({ id: "user-1" });
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("deve retornar 401 quando não houver header Authorization", () => {
        const req = mockReq({});
        const res = mockRes();
        const next: NextFunction = jest.fn();

        requireAuth(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(jwtMock.verify).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "Token não enviado" });
    });

    it("deve retornar 401 quando header não começar com 'Bearer '", () => {
        const req = mockReq({ authorization: "Basic xyz" });
        const res = mockRes();
        const next: NextFunction = jest.fn();

        requireAuth(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
    });

    it("deve retornar 401 quando jwt.verify lançar (token inválido/expirado)", () => {
        (jwtMock.verify as unknown as jest.Mock).mockImplementation(() => {
            throw new Error("jwt expired");
        });

        const req = mockReq({ authorization: "Bearer expirado" });
        const res = mockRes();
        const next: NextFunction = jest.fn();

        requireAuth(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "jwt expired" });
    });

    it("deve retornar 401 quando token estiver vazio após 'Bearer '", () => {
        const req = mockReq({ authorization: "Bearer " });
        const res = mockRes();
        const next: NextFunction = jest.fn();

        requireAuth(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "Token vazio" });
    });
});
