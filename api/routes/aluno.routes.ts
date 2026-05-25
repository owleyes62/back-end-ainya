import { Router } from "express";
import { AlunoController } from "../controllers/aluno.controller.js";

const alunoRouter = Router();

alunoRouter.get("/:id/resumo", AlunoController.getResumo);
alunoRouter.get("/:userId/home", AlunoController.getHome);

export default alunoRouter;