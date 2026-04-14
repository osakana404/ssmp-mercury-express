import express from "express";
import { createFullSupply } from "../controllers/supplyController.js";

const supplyRouter = express.Router();

supplyRouter.post("/", createFullSupply);

export { supplyRouter };
