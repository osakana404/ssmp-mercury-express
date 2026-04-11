import { Car, Part, Transaction } from "../models/associations.js";

export async function getAllTrans(req, res, next) {
  try {
    const result = await Transaction.findAll({
      include: [Part, Car],
      order: [["createdAt", "DESC"]], // Самые свежие сверху
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
