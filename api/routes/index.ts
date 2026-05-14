import { Router } from "express";

import userRouter from "./user.routes.js";
import formularioRouter from "./formulario.routes.js";
import canteiroRouter from "./canteiro.routes.js";
import plantTemplateRouter from "./planttemplate.routes.js";
import checklistRouter from "./checklist.routes.js";
import measurementRouter from "./measurement.routes.js";
import photoRouter from "./photo.routes.js";
import relatorioRouter from "./relatorio.routes.js";

const routes = Router();

routes.use("/users", userRouter);
routes.use("/formularios", formularioRouter);
routes.use("/canteiros", canteiroRouter);
routes.use("/plant-templates", plantTemplateRouter);
routes.use("/checklist", checklistRouter);
routes.use("/measurements", measurementRouter);
routes.use("/photos", photoRouter);
routes.use("/relatorios", relatorioRouter);

export default routes;