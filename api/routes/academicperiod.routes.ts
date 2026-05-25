import { Router } from "express";
import { AcademicPeriodController } from "../controllers/academicperiod.controller.js";

const academicperiodRouter = Router();

academicperiodRouter.get("/active", AcademicPeriodController.getActive);
academicperiodRouter.get("/", AcademicPeriodController.findAll);

export default academicperiodRouter;
