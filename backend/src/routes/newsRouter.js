import express from "express";
import {
  createNews,
  getAllNews,
  getSingleNews,
} from "../controllers/newsController.js";
import { upload } from "../config/multer.js";

const newsRouter = express.Router();

newsRouter.get("/", getAllNews);
newsRouter.get("/:id", getSingleNews);
newsRouter.post("/", upload.array("files", 10), createNews);
export { newsRouter };
