import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Batch = sequelize.define(
  "Batch",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    partId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    supplyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    initialQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    currentQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0, // Количество не может быть отрицательным
      },
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "empty"),
      defaultValue: "active",
    },
  },
  {
    tableName: "Batches",
    timestamps: true,
  },
);

export default Batch;
