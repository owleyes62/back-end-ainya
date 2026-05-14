import { Router } from "express";
import { AlunoController } from "../controllers/aluno.controller.js";

const alunoRouter = Router();

alunoRouter.get("/:id/resumo", AlunoController.getResumo);

export default alunoRouter;