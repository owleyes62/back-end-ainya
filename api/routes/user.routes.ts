import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { AuthController } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { loginLimiter } from "../middlewares/rate-limit.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const userRouter = Router();

// Públicos: cadastro e fluxo de auth
// loginLimiter protege contra brute-force de senha (10 tentativas / 15 min por IP)
userRouter.post("/", UserController.create);
userRouter.post("/login", loginLimiter, AuthController.login);
userRouter.post("/refresh", AuthController.refresh);
userRouter.post("/logout", AuthController.logout);

// Protegidos: precisam de Bearer accessToken
userRouter.get("/", requireAuth, UserController.getAll);
userRouter.get("/:id", requireAuth, UserController.findById);
userRouter.put("/:id/profile", requireAuth, UserController.updateProfile);
userRouter.put(
    "/:id/avatar",
    requireAuth,
    upload.single("avatar"),
    UserController.updateAvatar
);

export default userRouter;
