import { PartCategory, Part } from "../models/associations.js";

// Получить все категории
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await PartCategory.findAll({
      order: [["name", "ASC"]],
    });
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

// Создать новую категорию
export const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ message: "Название категории обязательно" });
    }

    const category = await PartCategory.create({ name });
    res.status(201).json(category);
  } catch (error) {
    // Обработка уникальности (если категория уже есть)
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .json({ message: "Такая категория уже существует" });
    }
    next(error);
  }
};

// Обновить категорию
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await PartCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Категория не найдена" });
    }

    await category.update({ name });
    res.json(category);
  } catch (error) {
    next(error);
  }
};

// Удалить категорию
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Проверяем, есть ли запчасти в этой категории
    const partsCount = await Part.count({ where: { categoryId: id } });
    if (partsCount > 0) {
      return res.status(400).json({
        message:
          "Нельзя удалить категорию, в которой есть запчасти. Сначала переместите их.",
      });
    }

    const category = await PartCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Категория не найдена" });
    }

    await category.destroy();
    res.json({ message: "Категория удалена" });
  } catch (error) {
    next(error);
  }
};
