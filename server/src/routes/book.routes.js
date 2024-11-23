import { addBookHandler } from "../controllers/books.controller.js";
import { Router } from "express";
import { uploadMultiple } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();
router.route("/").post(verifyJWT, addBookHandler).get().put().delete();
export default router;
