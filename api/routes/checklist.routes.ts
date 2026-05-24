import { Router } from "express";
import { ChecklistController } from "../controllers/checklist.controller.js";

const checklistRouter = Router();

checklistRouter.get("/formulario/:formularioId", ChecklistController.findByFormulario);
checklistRouter.patch("/:id", ChecklistController.updateChecked);
checklistRouter.put("/:id", ChecklistController.updateChecked);
checklistRouter.post("/", ChecklistController.create);

export default checklistRouter;