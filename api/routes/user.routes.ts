import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { AuthController } from "../controllers/auth.controller.js";

const userRouter = Router();

userRouter.post("/", UserController.create);
userRouter.post("/login", AuthController.login);
userRouter.post("/refresh", AuthController.refresh);
userRouter.post("/logout", AuthController.logout);
userRouter.get("/", UserController.getAll);
userRouter.get("/:id", UserController.findById);
userRouter.put("/:id/profile", UserController.updateProfile);
            
export default userRouter;
    