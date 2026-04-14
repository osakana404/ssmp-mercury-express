import {
  Part,
  Batch,
  Transaction,
  Car,
  PartCategory,
} from "../models/associations.js";
import { sequelize } from "../config/db.js";
import { Op } from "sequelize";

// 1. Отчет по остаткам (Стоимость склада)
export async function getInventoryReport(req, res, next) {
  try {
    const report = await Part.findAll({
      attributes: [
        "id",
        "name",
        "quantity",
        // Считаем сумму остатков по каждой запчасти через связанные активные партии
        [
          sequelize.literal(`(
            SELECT SUM(currentQuantity * price)
            FROM Batches
            WHERE Batches.partId = Part.id AND Batches.status = 'active'
          )`),
          "totalValue",
        ],
      ],
      include: [{ model: PartCategory, as: "category", attributes: ["name"] }],
      order: [["name", "ASC"]],
    });

    // Считаем общую сумму всего склада
    const totalStoreValue = report.reduce(
      (acc, part) => acc + (Number(part.getDataValue("totalValue")) || 0),
      0,
    );

    res.json({
      totalStoreValue,
      parts: report,
    });
  } catch (error) {
    next(error);
  }
}

// 2. Отчет по расходам на конкретную машину
export async function getCarExpenseReport(req, res, next) {
  try {
    const { carId } = req.params;

    const car = await Car.findByPk(carId);
    if (!car) return res.status(404).json({ message: "Машина не найдена" });

    const expenses = await Transaction.findAll({
      where: {
        carId,
        type: "списание",
      },
      // Добавляем as: 'Part', чтобы совпало с твоими ассоциациями
      include: [{ model: Part, as: "Part", attributes: ["name"] }],
      order: [["date", "DESC"]],
    });

    const totalSpent = expenses.reduce((acc, t) => acc + t.sum, 0);

    res.json({
      car: {
        number: car.number,
        model: car.model,
      },
      totalSpent,
      history: expenses,
    });
  } catch (error) {
    next(error);
  }
}
