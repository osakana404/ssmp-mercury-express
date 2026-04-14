import { Transaction, Part, Car, Supply } from "../models/associations.js";

export async function getAllTrans(req, res, next) {
  try {
    const result = await Transaction.findAll({
      include: [
        { model: Part, as: "Part", attributes: ["name"] },
        { model: Car, as: "Car", attributes: ["number", "model"] },
        { model: Supply, as: "supply", attributes: ["docNumber"] }, // Новое: видим номер накладной
      ],
      order: [["date", "DESC"]],
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

// Полезный метод: получить историю только по одной запчасти
export async function getTransByPart(req, res, next) {
  try {
    const { partId } = req.params;
    const history = await Transaction.findAll({
      where: { partId },
      include: [
        { model: Car, as: "Car" },
        { model: Supply, as: "supply" },
      ],
      order: [["date", "DESC"]],
    });
    res.json(history);
  } catch (error) {
    next(error);
  }
}
