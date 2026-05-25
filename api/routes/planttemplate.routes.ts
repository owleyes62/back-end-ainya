import { Router } from "express";
import { PlantTemplateController } from "../controllers/planttemplate.controller.js";

const planttemplateRouter = Router();

planttemplateRouter.get("/", PlantTemplateController.findAllByPlant);
planttemplateRouter.get("/plant/:plantId", PlantTemplateController.findAllByPlant);
planttemplateRouter.post("/", PlantTemplateController.create);

export default planttemplateRouter;