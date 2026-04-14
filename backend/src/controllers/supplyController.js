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
          include: [{ model: Part, as: "part", attributes: ["name"] }],
        },
      ],
      // Сортировка: сначала по дате документа (которую ввел юзер),
      // а если даты равны — по ID (самые новые созданные записи будут выше)
      order: [
        ["date", "DESC"],
        ["id", "DESC"],
      ],
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

    if (!supplierId || !items || !items.length) {
      return res
        .status(400)
        .json({ message: "Не указан поставщик или список товаров" });
    }

    const supplier = await Supplier.findByPk(supplierId);
    if (!supplier) {
      await t.rollback();
      return res
        .status(404)
        .json({ message: `Поставщик с ID ${supplierId} не найден` });
    }

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

    for (const item of items) {
      const part = await Part.findByPk(item.partId);
      if (!part) {
        throw new Error(`Запчасть с ID ${item.partId} не найдена в базе`);
      }

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

      await part.update(
        {
          quantity: part.quantity + item.quantity,
        },
        { transaction: t },
      );

      // ИСПРАВЛЕНО: Добавлен supplyId, чтобы транзакция знала, к какой накладной относится
      await Transaction.create(
        {
          partId: item.partId,
          supplyId: newSupply.id, // Добавили связь с накладной
          quantity: item.quantity,
          type: "приход",
          price: item.price,
          sum: item.price * item.quantity,
          // action мы убрали из модели, если ты ее обновил,
          // если оставил - оставь, но лучше убрать за ненадобностью
        },
        { transaction: t },
      );
    }

    await t.commit();
    res.status(201).json(newSupply);
  } catch (error) {
    await t.rollback();
    if (error.message.includes("не найдена")) {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
}
