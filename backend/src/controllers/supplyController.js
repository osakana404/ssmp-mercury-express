import { sequelize } from "../config/db.js";
import {
  Supply,
  Batch,
  Part,
  Transaction,
  Supplier,
} from "../models/associations.js";

export async function getAllSupplies(req, res, next) {
  try {
    const supplies = await Supply.findAll({
      include: [
        { model: Supplier, as: "supplier", attributes: ["name"] },
        {
          model: Batch,
          as: "batches",
          include: [{ model: Part, attributes: ["name"] }],
        },
      ],
      order: [["date", "DESC"]],
    });
    res.json(supplies);
  } catch (error) {
    next(error);
  }
}

export async function createFullSupply(req, res, next) {
  const t = await sequelize.transaction();

  try {
    const { supplierId, docNumber, date, items } = req.body;

    // ШАГ 0: Валидация входных данных
    if (!supplierId || !items || !items.length) {
      return res
        .status(400)
        .json({ message: "Не указан поставщик или список товаров" });
    }

    // Проверяем, существует ли поставщик
    const supplier = await Supplier.findByPk(supplierId);
    if (!supplier) {
      await t.rollback();
      return res
        .status(404)
        .json({ message: `Поставщик с ID ${supplierId} не найден` });
    }

    // 1. Создаем накладную
    const newSupply = await Supply.create(
      {
        supplierId,
        docNumber,
        date: date || new Date(),
        totalSum: items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0,
        ),
      },
      { transaction: t },
    );

    // 2. Обрабатываем товары
    for (const item of items) {
      // Проверяем существование запчасти
      const part = await Part.findByPk(item.partId);
      if (!part) {
        throw new Error(`Запчасть с ID ${item.partId} не найдена в базе`);
      }

      // Создаем партию
      await Batch.create(
        {
          partId: item.partId,
          supplyId: newSupply.id,
          initialQuantity: item.quantity,
          currentQuantity: item.quantity,
          price: item.price,
          status: "active",
        },
        { transaction: t },
      );

      // Обновляем остаток
      await part.update(
        {
          quantity: part.quantity + item.quantity,
        },
        { transaction: t },
      );

      // Логируем транзакцию
      await Transaction.create(
        {
          partId: item.partId,
          quantity: item.quantity,
          type: "приход",
          price: item.price,
          sum: item.price * item.quantity,
          action: "increment",
        },
        { transaction: t },
      );
    }

    await t.commit();
    res.status(201).json(newSupply);
  } catch (error) {
    await t.rollback();
    // Если мы сами выбросили ошибку про запчасть — вернем её текст
    if (error.message.includes("не найдена")) {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
}
