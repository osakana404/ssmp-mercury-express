import express from "express";
import {
  getAllSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplierController.js";

const supplierRouter = express.Router();

supplierRouter.get("/", getAllSuppliers);
supplierRouter.post("/", createSupplier);
supplierRouter.patch("/:id", updateSupplier);
supplierRouter.delete("/:id", deleteSupplier);

export { supplierRouter };
