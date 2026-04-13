import express from "express";
import { getAllCars } from "../controllers/carsController.js";

const carRouter = express.Router();

carRouter.get("/", getAllCars);

export { carRouter };
