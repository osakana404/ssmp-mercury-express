import express from "express";
import { prihod, spisanie } from "../controllers/partController.js";

const partRouter = express.Router();

partRouter.post("/prihod", prihod);
partRouter.post("/spisanie", spisanie);

export { partRouter };
