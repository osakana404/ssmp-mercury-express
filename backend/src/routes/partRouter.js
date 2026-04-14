import express from "express";
import {
  getAllParts,
  createPart,
  getPartById,
  updatePart,
  deletePart,
} from "../controllers/partController.js";
import { createFifoDisbursement } from "../controllers/disbursementController.js";

const partRouter = express.Router();

partRouter.get("/", getAllParts);
partRouter.get("/:id", getPartById);
partRouter.post("/", createPart);
partRouter.patch("/:id", updatePart);
partRouter.delete("/:id", deletePart);

// Списание запчасти на машину (FIFO)
partRouter.post("/disburse", createFifoDisbursement);

export { partRouter };
