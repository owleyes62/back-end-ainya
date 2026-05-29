import { Router } from "express";
import { InstitutionController } from "../controllers/institution.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const institutionRouter = Router();

// Público: a tela de cadastro precisa listar as instituições antes do login.
institutionRouter.get("/", InstitutionController.getAll);

// Protegido: só usuário autenticado pode criar nova instituição.
institutionRouter.post("/", requireAuth, InstitutionController.create);

export default institutionRouter;
