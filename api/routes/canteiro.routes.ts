import { Router } from "express";
import { CanteiroController } from "../controllers/canteiro.controller.js";

const canteiroRouter = Router();

canteiroRouter.get("/", CanteiroController.findAllByUser);
canteiroRouter.get("/usuario/:userId", CanteiroController.findByUser);
canteiroRouter.get("/user/:userId", CanteiroController.findByUser);
canteiroRouter.get("/:canteiroId/listas", CanteiroController.findListas);
canteiroRouter.post("/", CanteiroController.create);

export default canteiroRouter;
