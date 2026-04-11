import express from "express";
import { getAllTrans } from "../controllers/transactionController.js";

const transactionRouter = express.Router();

transactionRouter.get("/", getAllTrans);

export { transactionRouter };
