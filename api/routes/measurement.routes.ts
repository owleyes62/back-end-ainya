import { Router } from "express";
import { MeasurementController } from "../controllers/measurement.controller.js";

const measurementRouter = Router();

measurementRouter.get("/formulario/:formularioId", MeasurementController.findByFormulario);
measurementRouter.patch("/:id", MeasurementController.updateValue);
measurementRouter.put("/:id", MeasurementController.updateValue);
measurementRouter.post("/", MeasurementController.create);

export default measurementRouter;