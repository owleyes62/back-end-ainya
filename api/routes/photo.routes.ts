
import { Router } from "express";
import { PhotoController } from "../controllers/photo.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const photoRouter = Router();

photoRouter.post("/", PhotoController.create);
photoRouter.post("/upload", upload.single("photo"), PhotoController.createForFormulario);
photoRouter.get("/formulario/:formularioId", PhotoController.findByFormulario);
photoRouter.delete("/:id", PhotoController.delete);

export default photoRouter;
