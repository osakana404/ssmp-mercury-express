import { Car } from "../models/associations.js";

export async function getAllCars(req, res, next) {
  try {
    const result = await Car.findAll({
      order: [["createdAt", "DESC"]], // свежие сверху
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function createCars(req, res, next) {
  try {
    const { number, model, description, status } = req.body;
    if (!number || !model) {
      return res.status(400).json({
        message: "Поля гос.номер и модель машины обязательны к заполнению",
      });
    }
    const newCar = await Car.create({
      number: number,
      model: model,
      description: description,
      status: status,
    });

    res.status(201).json({ message: "Машина добавлена", data: newCar });
  } catch (error) {
    next(error);
  }
}

export async function updateCars(req, res, next) {
  try {
    const id = req.params.id;

    const { number, model, description, status } = req.body;

    const findCar = await Car.findByPk(id);

    if (!findCar) {
      return res.status(400).json({ message: "Машина не найдена" });
    }

    findCar.number = number ? number : findCar.number;
    findCar.model = model ? model : findCar.model;
    findCar.description = description ? description : findCar.description;
    findCar.status = status ? status : findCar.status;

    await findCar.save();

    res.status(200).json({ message: "Успешно обновлено" });
  } catch (error) {
    next(error);
  }
}

export async function deleteCars(req, res, next) {
  const id = req.params.id;
  const findCar = await Car.findByPk(id);

  if (!findCar) {
    return res.status(404).json({ message: "Машина не найдена" });
  }

  await findCar.destroy();

  return res.status(200).json({
    message: `Машина ${findCar.model} с номером ${findCar.number} успешно удалена!`,
  });
}
