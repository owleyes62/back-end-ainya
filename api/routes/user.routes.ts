import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
            
const userRouter = Router();

//cadastro
userRouter.post("/", UserController.create);
//login
userRouter.post("/login", UserController.login);
//listar
userRouter.get("/", UserController.getAll);
            
export default userRouter;
    