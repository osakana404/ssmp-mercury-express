import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Part = sequelize.define(
  "Part",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0, // Оставляем как общий счетчик
    },
    description: {
      type: DataTypes.TEXT,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "Parts",
    timestamps: true,
  },
);

export default Part;
