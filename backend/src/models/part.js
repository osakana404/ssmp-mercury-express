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
      defaultValue: 0,
    },
    price: {
      type: DataTypes.FLOAT, // или DECIMAL(10, 2) для денег
      defaultValue: 0,
    },
    description: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "Parts",
    timestamps: true,
  },
);

export default Part;
