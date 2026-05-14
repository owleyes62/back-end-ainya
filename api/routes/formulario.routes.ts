import { Router } from "express";
import { FormularioController } from "../controllers/formulario.controller.js";

const formularioRouter = Router();

formularioRouter.get("/", FormularioController.findAllByUser);
formularioRouter.post("/", FormularioController.create);

export default formularioRouter;