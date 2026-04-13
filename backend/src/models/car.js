import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Car = sequelize.define(
  "Car",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Номер машины обычно уникален
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: "Без описания",
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "в работе", // Например: в работе, ремонт, списана
    },
  },
  {
    tableName: "Cars",
    timestamps: true,
  },
);

export default Car;
