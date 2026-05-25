import { Router } from "express";
import { UserCanteiroController } from "../controllers/usercanteiro.controller.js";

const userCanteiroRouter = Router();

userCanteiroRouter.post("/", UserCanteiroController.create);
userCanteiroRouter.get("/user/:userId", UserCanteiroController.findByUser);
userCanteiroRouter.get("/canteiro/:canteiroId", UserCanteiroController.findByCanteiro);
userCanteiroRouter.delete("/", UserCanteiroController.delete);

export default userCanteiroRouter;
