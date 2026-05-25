import { Router } from "express";
import { TurmaController } from "../controllers/turma.controller.js";

const turmaRouter = Router();

turmaRouter.get("/", TurmaController.findAll);
turmaRouter.get("/:id", TurmaController.findById);

export default turmaRouter;
