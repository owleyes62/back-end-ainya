import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { AuthController } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const userRouter = Router();

// Públicos: cadastro e fluxo de auth
userRouter.post("/", UserController.create);
userRouter.post("/login", AuthController.login);
userRouter.post("/refresh", AuthController.refresh);
userRouter.post("/logout", AuthController.logout);

// Protegidos: precisam de Bearer accessToken
userRouter.get("/", requireAuth, UserController.getAll);
userRouter.get("/:id", requireAuth, UserController.findById);
userRouter.put("/:id/profile", requireAuth, UserController.updateProfile);

export default userRouter;
