import express from "express";
import {
  getInventoryReport,
  getCarExpenseReport,
} from "../controllers/reportController.js";

const reportRouter = express.Router();

// Посмотреть стоимость всего склада
reportRouter.get("/inventory", getInventoryReport);

// Посмотреть расходы по конкретной машине (передаем ID машины)
reportRouter.get("/car/:carId", getCarExpenseReport);

export { reportRouter };
