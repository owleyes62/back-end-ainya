import { Router } from "express";

import userRouter from "./user.routes.js";
import formularioRouter from "./formulario.routes.js";
import canteiroRouter from "./canteiro.routes.js";
import plantaforrageiraRouter from "./plantaforrageira.routes.js";
import listadeformulariosRouter from "./listadeformularios.routes.js";
import institutionRouter from "./institution.routes.js";

const routes = Router();

routes.get("/health", (_req, res) => {
    return res.status(200).json({
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV ?? "development",
    });
});

routes.use("/users", userRouter);
routes.use("/institutions", institutionRouter);
routes.use("/formularios", formularioRouter);
routes.use("/canteiros", canteiroRouter);
routes.use("/plantas-forrageiras", plantaforrageiraRouter);
routes.use("/listas-formularios", listadeformulariosRouter);

export default routes;