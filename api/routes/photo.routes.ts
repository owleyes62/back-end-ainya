
import { Router } from "express";
import { PhotoController } from "../controllers/photo.controller.js";
            
const photoRouter = Router();
            
photoRouter.post("/", PhotoController.create);
photoRouter.delete("/:id", PhotoController.delete);
     
export default photoRouter;
    