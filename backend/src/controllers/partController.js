import { Part, Transaction, Car } from "../models/associations.js";

export async function prihod(req, res, next) {
  try {
    const { name, quantity, description, price, date } = req.body;

    // 1. Валидация входных данных
    if (!name || !quantity || !price) {
      return res.status(400).json({
        message: "Имя, количество и цена обязательны для прихода",
      });
    }

    // 2. Ищем, есть ли уже такая запчасть в базе
    let part = await Part.findOne({ where: { name: name } });

    if (part) {
      // СЦЕНАРИЙ А: Запчасть найдена, просто пополняем остаток
      // Используем атомарный increment для безопасности
      await part.increment("quantity", { by: quantity });

      // Если пришла новая цена, можно обновить её у запчасти
      if (price !== part.price) {
        part.price = price;
        await part.save();
      }
    } else {
      // СЦЕНАРИЙ Б: Запчасти нет, создаем новую запись
      part = await Part.create({
        name,
        quantity,
        description,
        price,
      });
    }

    // 3. Создаем запись о транзакции (общая логика для обоих сценариев)
    // Используем id запчасти (нового или найденного объекта part)
    const transaction = await Transaction.create({
      partId: part.id,
      quantity: quantity,
      type: "приход",
      price: price, // фиксируем цену именно этой закупки
      date: date || new Date(),
    });

    // 4. Возвращаем успешный ответ
    return res.status(201).json({
      message: "Приход успешно оформлен",
      data: {
        partName: part.name,
        currentQuantity: part.quantity + (part instanceof Part ? 0 : 0), // Sequelize обновит объект после increment не сразу, но в базе всё ок
        transaction,
      },
    });
  } catch (error) {
    // Если что-то пошло не так (например, ошибка базы), передаем ошибку в middleware
    next(error);
  }
}

export async function spisanie(req, res, next) {
  try {
    const { partId, carId, quantity, price, date } = req.body;

    if (!partId || !carId || !quantity) {
      return res.status(400).json({
        message: "Заполните все поля",
      });
    }
    const part = await Part.findByPk(partId); // ретурнит экземпляр модели (объект)
    const car = await Car.findByPk(carId); // находим объект машины
    if (part.quantity < quantity) {
      return res
        .status(400)
        .json({ message: "Вы пытаетесь списать больше чем нужно" });
    }
    if (!car) {
      return res.status(404).json({ message: "Машина не найдена" });
    }
    // part.quantity = part.quantity - quantity;
    // await part.save();
    // пусть база сама вычтет:
    await part.decrement("quantity", { by: quantity });

    const transaction = await Transaction.create({
      partId: part.id,
      carId: car.id,
      quantity: quantity, // количество сколько списал
      type: "списание",
      price: price || part.price, // если механик хочет зафиксировать цену из накладной вручную ИЛИ взять автоматом
      date: date || new Date(),
    });

    return res
      .status(201)
      .json({ message: "Успешно списано!", data: transaction });
  } catch (error) {
    next(error);
  }
}
