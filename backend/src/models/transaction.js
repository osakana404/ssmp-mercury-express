import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Transaction = sequelize.define(
  "Transaction",
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
    carId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Только для списания
    },
    supplyId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Только для прихода
    },
    type: {
      type: DataTypes.ENUM("приход", "списание"),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT, // Цена за единицу в этой операции
      allowNull: false,
    },
    sum: {
      type: DataTypes.FLOAT, // Итого: quantity * price
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true, // Можно добавить причину списания или заметку
    },
  },
  {
    tableName: "Transactions",
    timestamps: true,
  },
);

export default Transaction;
