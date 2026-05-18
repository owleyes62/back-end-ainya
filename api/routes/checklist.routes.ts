import { Router } from "express";
import { ChecklistController } from "../controllers/checklist.controller.js";

const checklistRouter = Router();

checklistRouter.patch("/:id", ChecklistController.updateChecked);
checklistRouter.post("/", ChecklistController.create);

export default checklistRouter;