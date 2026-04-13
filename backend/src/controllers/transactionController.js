import { Car, Part, Transaction } from "../models/associations.js";

export async function getAllTrans(req, res, next) {
  try {
    const result = await Transaction.findAll({
      include: [
        { model: Part, as: "Part" },
        { model: Car, as: "Car" },
      ],
      order: [["createdAt", "DESC"]], // Самые свежие сверху
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
