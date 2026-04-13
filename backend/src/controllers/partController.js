import { Part, Transaction, Car } from "../models/associations.js";

export async function getAllParts(req, res, next) {
  try {
    const parts = await Part.findAll({
      order: [["name", "ASC"]],
    });
    res.status(200).json(parts);
  } catch (error) {
    next(error);
  }
}

export async function prihod(req, res, next) {
  try {
    const { name, quantity, description, price, date } = req.body;

    if (!name || !quantity || !price) {
      return res.status(400).json({
        message: "Имя, количество и цена обязательны для прихода",
      });
    }

    let part = await Part.findOne({ where: { name: name } });
    let currentAction = "increment"; // По умолчанию - пополнение

    if (part) {
      // СЦЕНАРИЙ А: Пополнение
      await part.increment("quantity", { by: quantity });

      // Обновляем описание и цену, если они изменились
      if (price !== part.price || description !== part.description) {
        part.price = price;
        part.description = description;
        await part.save();
      }
    } else {
      // СЦЕНАРИЙ Б: Создание новой запчасти
      part = await Part.create({
        name,
        quantity,
        description,
        price,
      });
      currentAction = "create"; // Меняем статус на "создание"
    }

    // Создаем транзакцию с учетом поля action
    const transaction = await Transaction.create({
      partId: part.id,
      quantity: quantity,
      type: "prihod", // Латиница для удобства фронта
      action: currentAction, // Наш новый ENUM
      price: price,
      date: date || new Date(),
    });

    return res.status(201).json({
      message: "Приход успешно оформили",
      data: {
        partName: part.name,
        action: currentAction,
        transaction,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function spisanie(req, res, next) {
  try {
    const { partId, carId, quantity, price, date } = req.body;

    if (!partId || !carId || !quantity) {
      return res.status(400).json({ message: "Заполните все поля" });
    }

    const part = await Part.findByPk(partId);
    const car = await Car.findByPk(carId);

    if (!part) return res.status(404).json({ message: "Запчасть не найдена" });
    if (!car) return res.status(404).json({ message: "Машина не найдена" });

    if (part.quantity < quantity) {
      return res
        .status(400)
        .json({ message: "Недостаточное количество на складе" });
    }

    await part.decrement("quantity", { by: quantity });

    const transaction = await Transaction.create({
      partId: part.id,
      carId: car.id,
      quantity: quantity,
      type: "spisanie", // Латиница
      action: "increment", // Для списания action не так критичен, но поле обязательное (NOT NULL)
      price: price || part.price,
      date: date || new Date(),
    });

    return res
      .status(201)
      .json({ message: "Успешно списано!", data: transaction });
  } catch (error) {
    next(error);
  }
}
