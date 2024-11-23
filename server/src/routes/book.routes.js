import { addBookHandler } from "../controllers/books.controller.js";
import { Router } from "express";
import { uploadMultiple } from "../middlewares/multer.middleware.js";
const router = Router();
router
  .route("/")
  .post(
    (req, res, next) => {
      console.log(req.files);
      next();
    },
    addBookHandler
  )
  .get()
  .put()
  .delete();
export default router;
