import {
  Part,
  Batch,
  Transaction,
  Car,
  PartCategory,
} from "../models/associations.js";
import { Op } from "sequelize";

// 1. Отчет по остаткам (Стоимость склада)
export async function getInventoryReport(req, res, next) {
  try {
    const report = await Part.findAll({
      attributes: ["id", "name", "quantity"],
      include: [
        {
          model: PartCategory,
          as: "category",
          attributes: ["name"],
        },
        {
          model: Batch,
          as: "batches",
          attributes: ["currentQuantity", "price"],
          where: {
            currentQuantity: { [Op.gt]: 0 }, // Берем только те, где что-то есть
            status: "active",
          },
          required: false, // Чтобы запчасть показывалась в списке, даже если партий нет
        },
      ],
      order: [["name", "ASC"]],
    });
    //150877

    // Обрабатываем данные в JS (это надежнее и проще отлаживать)
    const formattedReport = report.map((part) => {
      const partJson = part.toJSON();

      // Считаем сумму по всем пришедшим партиям для этой запчасти
      const totalValue = (partJson.batches || []).reduce((sum, batch) => {
        return sum + batch.currentQuantity * batch.price;
      }, 0);

      return {
        ...partJson,
        totalValue: Number(totalValue.toFixed(2)),
      };
    });

    // Считаем общую сумму склада
    const totalStoreValue = formattedReport.reduce(
      (acc, part) => acc + part.totalValue,
      0,
    );

    res.json({
      totalStoreValue: Number(totalStoreValue.toFixed(2)),
      parts: formattedReport,
    });
  } catch (error) {
    console.error("Ошибка в отчете:", error);
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

    const totalSpent = expenses.reduce(
      (acc, t) => acc + (parseFloat(t.sum) || 0),
      0,
    );

    res.json({
      car: {
        number: car.number,
        model: car.model,
      },
      totalSpent: Number(totalSpent.toFixed(2)), // Округляем до копеек
      history: expenses,
    });
  } catch (error) {
    next(error);
  }
}
