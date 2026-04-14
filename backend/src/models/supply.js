import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Supply = sequelize.define(
  "Supply",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    supplierId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Suppliers",
        key: "id",
      },
    },
    docNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    totalSum: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Supplies",
    timestamps: true,
  },
);

export default Supply;
