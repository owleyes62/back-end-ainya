import { Router } from "express";
import { FormularioController } from "../controllers/formulario.controller.js";
import { ChecklistController } from "../controllers/checklist.controller.js";
import { MeasurementController } from "../controllers/measurement.controller.js";
import { PhotoController } from "../controllers/photo.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const formularioRouter = Router();

formularioRouter.post("/:id/checklist", ChecklistController.createManyForFormulario);
formularioRouter.get("/:user_id", FormularioController.findAllByUser);
formularioRouter.post("/", FormularioController.create);
formularioRouter.post("/:id/measurements", MeasurementController.createManyForFormulario);
formularioRouter.post(
    "/:id/photos",
    upload.single("photo"),
    PhotoController.createForFormulario
);

export default formularioRouter;