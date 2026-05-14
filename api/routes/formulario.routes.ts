import { Router } from "express";
import { FormularioController } from "../controllers/formulario.controller.js";
import { ChecklistController } from "../controllers/checklist.controller.js";

const formularioRouter = Router();

formularioRouter.post("/:id/checklist", ChecklistController.createManyForFormulario);
formularioRouter.get("/:user_id", FormularioController.findAllByUser);
formularioRouter.post("/", FormularioController.create);

export default formularioRouter;