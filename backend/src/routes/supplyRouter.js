import express from "express";
import {
  createFullSupply,
  getAllSupplies,
} from "../controllers/supplyController.js";

const supplyRouter = express.Router();

supplyRouter.post("/", createFullSupply);
supplyRouter.get("/", getAllSupplies);

export { supplyRouter };
