import { Router } from "express";
import { AlunoTurmaController } from "../controllers/alunoturma.controller.js";

const alunoturmaRouter = Router();

alunoturmaRouter.post("/", AlunoTurmaController.create);
alunoturmaRouter.get("/user/:userId", AlunoTurmaController.findByUser);

export default alunoturmaRouter;
