import express from "express";
import {
  createNews,
  getAllNews,
  getSingleNews,
} from "../controllers/newsController.js";

const newsRouter = express.Router();

newsRouter.get("/", getAllNews);
newsRouter.get("/:id", getSingleNews);
newsRouter.post("/", createNews);
export { newsRouter };
