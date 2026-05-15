import { Router } from "express";
import userRouter from "./user.routes.js";
import canteiroRouter from "./canteiro.routes.js";
import plantaforrageiraRouter from "./plantaforrageira.routes.js";
import listadeformulariosRouter from "./listadeformularios.routes.js";
import relatorioRouter from "./relatorio.routes.js"; 

const routes = Router();

routes.use("/users", userRouter);
routes.use("/canteiros", canteiroRouter);
routes.use("/plantas-forrageiras", plantaforrageiraRouter);
routes.use("/listas-formularios", listadeformulariosRouter);
routes.use("/relatorios", relatorioRouter);

export default routes;