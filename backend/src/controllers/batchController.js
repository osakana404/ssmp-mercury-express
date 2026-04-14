import { Batch, Part, Supply, Supplier } from "../models/associations.js";
import { Op } from "sequelize";

// 1. Получить вообще все партии (архив + активные)
export async function getAllBatches(req, res, next) {
  try {
    const batches = await Batch.findAll({
      include: [
        { model: Part, as: "part", attributes: ["name", "quantity"] },
        {
          model: Supply,
          as: "supply",
          attributes: ["docNumber", "date"],
          include: [{ model: Supplier, as: "supplier", attributes: ["name"] }],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(batches);
  } catch (error) {
    next(error);
  }
}

// 2. Получить только активные партии (те, что реально лежат на складе)
export async function getActiveBatches(req, res, next) {
  try {
    const batches = await Batch.findAll({
      where: {
        currentQuantity: { [Op.gt]: 0 },
        status: "active",
      },
      include: [
        { model: Part, as: "part", attributes: ["name"] },
        { model: Supply, as: "supply", attributes: ["docNumber", "date"] },
      ],
      order: [["createdAt", "ASC"]], // Сортировка по FIFO (старые сверху)
    });
    res.json(batches);
  } catch (error) {
    next(error);
  }
}

// 3. Получить партии конкретной запчасти
export async function getBatchesByPart(req, res, next) {
  try {
    const { partId } = req.params;
    const batches = await Batch.findAll({
      where: { partId },
      include: [
        { model: Supply, as: "supply", attributes: ["docNumber", "date"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(batches);
  } catch (error) {
    next(error);
  }
}

// 4. Ручная корректировка партии (на случай инвентаризации/ошибок)
export async function updateBatchQuantity(req, res, next) {
  try {
    const { id } = req.params;
    const { currentQuantity, status } = req.body;

    const batch = await Batch.findByPk(id);
    if (!batch) return res.status(404).json({ message: "Партия не найдена" });

    // ВАЖНО: При ручном изменении партии нужно будет также обновить общий quantity в Part.
    // Но обычно это делают через отдельный процесс инвентаризации.

    await batch.update({
      currentQuantity: currentQuantity ?? batch.currentQuantity,
      status: status ?? batch.status,
    });

    res.json({ message: "Партия обновлена", batch });
  } catch (error) {
    next(error);
  }
}
