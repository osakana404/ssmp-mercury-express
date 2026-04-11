import express from "express";
import {
  getAllParts,
  prihod,
  spisanie,
} from "../controllers/partController.js";

const partRouter = express.Router();

partRouter.get("/", getAllParts);
partRouter.post("/prihod", prihod);
partRouter.post("/spisanie", spisanie);

export { partRouter };
