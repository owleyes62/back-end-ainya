import { Router } from "express";

import userRouter from "./user.routes.js";
import formularioRouter from "./formulario.routes.js";
import canteiroRouter from "./canteiro.routes.js";
import plantaforrageiraRouter from "./plantaforrageira.routes.js";
import listadeformulariosRouter from "./listadeformularios.routes.js";
import institutionRouter from "./institution.routes.js";
import alunoRouter from "./aluno.routes.js";
import userCanteiroRouter from "./usercanteiro.routes.js";
import checklistRouter from "./checklist.routes.js";
import measurementRouter from "./measurement.routes.js";
import photoRouter from "./photo.routes.js";
import relatorioRouter from "./relatorio.routes.js";
import planttemplateRouter from "./planttemplate.routes.js";
import turmaRouter from "./turma.routes.js";
import alunoturmaRouter from "./alunoturma.routes.js";
import academicperiodRouter from "./academicperiod.routes.js";

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
routes.use("/alunos", alunoRouter);
routes.use("/user-canteiros", userCanteiroRouter);
routes.use("/checklist", checklistRouter);
routes.use("/measurements", measurementRouter);
routes.use("/photos", photoRouter);
routes.use("/relatorios", relatorioRouter);
routes.use("/plant-templates", planttemplateRouter);
routes.use("/turmas", turmaRouter);
routes.use("/aluno-turma", alunoturmaRouter);
routes.use("/academic-periods", academicperiodRouter);

export default routes;
