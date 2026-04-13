import express from "express";
import {
  createCars,
  deleteCars,
  getAllCars,
  updateCars,
} from "../controllers/carsController.js";

const carRouter = express.Router();

carRouter.get("/", getAllCars);
carRouter.post("/", createCars); // /api/v1/cars
carRouter.patch("/:id", updateCars); // /api/v1/cars/1
carRouter.delete("/:id", deleteCars); // /api/v1/cars/1

export { carRouter };
