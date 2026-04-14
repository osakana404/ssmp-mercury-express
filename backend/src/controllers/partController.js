import { Part, PartCategory, Batch } from "../models/associations.js";

// 1. Получить все запчасти (с категориями и остатками)
export async function getAllParts(req, res, next) {
  try {
    const parts = await Part.findAll({
      include: [
        { model: PartCategory, as: "category" }, // Видим название категории
      ],
      order: [["name", "ASC"]],
    });
    res.status(200).json(parts);
  } catch (error) {
    next(error);
  }
}

// 2. Создать карточку запчасти (без прихода, просто регистрация в базе)
export async function createPart(req, res, next) {
  try {
    const { name, description, categoryId } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Название запчасти обязательно" });
    }

    const newPart = await Part.create({
      name,
      description,
      categoryId,
      quantity: 0, // При создании всегда 0, пока не сделаем Supply
    });

    res.status(201).json(newPart);
  } catch (error) {
    next(error);
  }
}

// 3. Получить одну запчасть детально (включая все её активные партии)
export async function getPartById(req, res, next) {
  try {
    const { id } = req.params;
    const part = await Part.findByPk(id, {
      include: [
        { model: PartCategory, as: "category" },
        {
          model: Batch,
          as: "batches",
          where: { status: "active" },
          required: false, // Если партий нет, всё равно покажем запчасть
        },
      ],
    });

    if (!part) {
      return res.status(404).json({ message: "Запчасть не найдена" });
    }

    res.status(200).json(part);
  } catch (error) {
    next(error);
  }
}

// 4. Редактировать карточку (название, описание, категорию)
export async function updatePart(req, res, next) {
  try {
    const { id } = req.params;
    const { name, description, categoryId } = req.body;

    const part = await Part.findByPk(id);
    if (!part) {
      return res.status(404).json({ message: "Запчасть не найдена" });
    }

    await part.update({ name, description, categoryId });
    res.status(200).json(part);
  } catch (error) {
    next(error);
  }
}

// 5. Удалить запчасть
export async function deletePart(req, res, next) {
  try {
    const { id } = req.params;
    const part = await Part.findByPk(id);

    if (!part) {
      return res.status(404).json({ message: "Запчасть не найдена" });
    }

    // Проверяем, есть ли остатки, прежде чем удалять
    if (part.quantity > 0) {
      return res.status(400).json({
        message:
          "Нельзя удалить запчасть, пока она есть на складе. Сначала спишите остатки.",
      });
    }

    await part.destroy();
    res.status(200).json({ message: "Карточка запчасти удалена" });
  } catch (error) {
    next(error);
  }
}
