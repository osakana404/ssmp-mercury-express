import { Supplier } from "../models/associations.js";

// Получить список всех поставщиков
export async function getAllSuppliers(req, res, next) {
  try {
    const suppliers = await Supplier.findAll({
      order: [["name", "ASC"]],
    });
    res.status(200).json(suppliers);
  } catch (error) {
    next(error);
  }
}

// Добавить нового поставщика
export async function createSupplier(req, res, next) {
  try {
    const { name, phone, email, address, inn } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ message: "Название поставщика обязательно" });
    }

    const newSupplier = await Supplier.create({
      name,
      phone,
      email,
      address,
      inn,
    });

    res.status(201).json(newSupplier);
  } catch (error) {
    // Обработка ошибки уникальности ИНН
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .json({ message: "Поставщик с таким ИНН уже существует" });
    }
    next(error);
  }
}

// Обновить данные поставщика
export async function updateSupplier(req, res, next) {
  try {
    const { id } = req.params;
    const { name, phone, email, address, inn } = req.body;

    const supplier = await Supplier.findByPk(id);
    if (!supplier) {
      return res.status(404).json({ message: "Поставщик не найден" });
    }

    await supplier.update({ name, phone, email, address, inn });
    res.status(200).json(supplier);
  } catch (error) {
    next(error);
  }
}

// Удалить поставщика
export async function deleteSupplier(req, res, next) {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findByPk(id);

    if (!supplier) {
      return res.status(404).json({ message: "Поставщик не найден" });
    }

    await supplier.destroy();
    res.status(200).json({ message: "Поставщик успешно удален" });
  } catch (error) {
    next(error);
  }
}
