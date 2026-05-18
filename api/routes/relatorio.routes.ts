import { Router } from "express";
import { RelatorioController } from "../controllers/relatorio.controller.js";
            
const relatorioRouter = Router();
            
// Rotas da Atividade 1
relatorioRouter.get("/usuario/:userId", RelatorioController.findByUser);
relatorioRouter.post("/gerar", RelatorioController.generate);

// Rotas da Atividade 2
// Rota para buscar um relatório específico
relatorioRouter.get("/:id", RelatorioController.findById);

// Rota para o salvamento automático do objetivo
relatorioRouter.patch("/:id/objetivo", RelatorioController.updateObjective);
            
export default relatorioRouter;