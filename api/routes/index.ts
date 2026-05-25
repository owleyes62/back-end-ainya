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

import { requireAuth } from "../middlewares/auth.middleware.js";

const routes = Router();

// Público: usado por health check / monitoramento
routes.get("/health", (_req, res) => {
    return res.status(200).json({
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV ?? "development",
    });
});

// /users tem rotas públicas (login, cadastro) e protegidas — controle interno
routes.use("/users", userRouter);

// Demais routers exigem Bearer accessToken
routes.use("/institutions", requireAuth, institutionRouter);
routes.use("/formularios", requireAuth, formularioRouter);
routes.use("/canteiros", requireAuth, canteiroRouter);
routes.use("/plantas-forrageiras", requireAuth, plantaforrageiraRouter);
routes.use("/listas-formularios", requireAuth, listadeformulariosRouter);
routes.use("/alunos", requireAuth, alunoRouter);
routes.use("/user-canteiros", requireAuth, userCanteiroRouter);
routes.use("/checklist", requireAuth, checklistRouter);
routes.use("/measurements", requireAuth, measurementRouter);
routes.use("/photos", requireAuth, photoRouter);
routes.use("/relatorios", requireAuth, relatorioRouter);
routes.use("/plant-templates", requireAuth, planttemplateRouter);
routes.use("/turmas", requireAuth, turmaRouter);
routes.use("/aluno-turma", requireAuth, alunoturmaRouter);
routes.use("/academic-periods", requireAuth, academicperiodRouter);

export default routes;
