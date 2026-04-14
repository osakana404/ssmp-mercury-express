import express from "express";
import {
  getAllBatches,
  getActiveBatches,
  getBatchesByPart,
  updateBatchQuantity,
} from "../controllers/batchController.js";

const batchRouter = express.Router();

batchRouter.get("/", getAllBatches); // Все партии
batchRouter.get("/active", getActiveBatches); // Только те, что в наличии
batchRouter.get("/part/:partId", getBatchesByPart); // По конкретной детали
batchRouter.patch("/:id", updateBatchQuantity); // Редактирование

export { batchRouter };
