import { sequelize } from "../config/db.js";
import { Part, Batch, Transaction, Car } from "../models/associations.js";
import { Op } from "sequelize";

export async function createFifoDisbursement(req, res, next) {
  const t = await sequelize.transaction();

  try {
    const { partId, carId, quantity } = req.body;

    // 1. Проверки
    if (!partId || !carId || !quantity || quantity <= 0) {
      return res
        .status(400)
        .json({ message: "Неверные данные: проверьте ID и количество" });
    }

    const car = await Car.findByPk(carId);
    if (!car) {
      await t.rollback();
      return res.status(404).json({ message: "Машина не найдена" });
    }

    const part = await Part.findByPk(partId);
    if (!part || part.quantity < quantity) {
      await t.rollback();
      return res.status(400).json({ message: "Недостаточно товара на складе" });
    }

    // 2. Ищем активные партии этой запчасти, сортируем от старых к новым (FIFO)
    const batches = await Batch.findAll({
      where: {
        partId: partId,
        currentQuantity: { [Op.gt]: 0 },
        status: "active",
      },
      order: [["createdAt", "ASC"]], // Сначала самые старые
      transaction: t,
    });

    let remainingToSpisat = quantity;
    let totalSpentSum = 0;

    // 3. Цикл списания по партиям
    for (const batch of batches) {
      if (remainingToSpisat <= 0) break;

      let takeFromThisBatch = Math.min(
        batch.currentQuantity,
        remainingToSpisat,
      );

      // Считаем сумму для транзакции (по цене конкретной партии)
      totalSpentSum += takeFromThisBatch * batch.price;

      // Обновляем партию
      batch.currentQuantity -= takeFromThisBatch;
      if (batch.currentQuantity === 0) {
        batch.status = "empty";
      }
      await batch.save({ transaction: t });

      remainingToSpisat -= takeFromThisBatch;
    }

    // 4. Обновляем общий счетчик в таблице Part
    await part.update(
      {
        quantity: part.quantity - quantity,
      },
      { transaction: t },
    );

    // 5. Создаем запись в транзакциях (для истории обслуживания машины)
    const newTransaction = await Transaction.create(
      {
        partId: partId,
        carId: carId,
        quantity: quantity,
        type: "списание",
        action: "increment", // для совместимости с твоим ENUM, хотя по сути это расход
        price: totalSpentSum / quantity, // средняя цена списания для логов
        sum: totalSpentSum,
        date: new Date(),
      },
      { transaction: t },
    );

    await t.commit();

    res.status(201).json({
      message: `Списано ${quantity} шт. на машину ${car.number}`,
      totalSum: totalSpentSum,
      transaction: newTransaction,
    });
  } catch (error) {
    await t.rollback();
    next(error);
  }
}
