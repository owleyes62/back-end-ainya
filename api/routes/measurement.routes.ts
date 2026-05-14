import { Router } from "express";
import { MeasurementController } from "../controllers/measurement.controller.js";

const measurementRouter = Router();

measurementRouter.patch("/:id", MeasurementController.updateValue);
measurementRouter.post("/", MeasurementController.create);

export default measurementRouter;