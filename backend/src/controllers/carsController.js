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
