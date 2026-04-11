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
      // Поле для связи с таблицей Parts
    },
    carId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // Разрешаем null, так как при "приходе" машина не нужна
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING, // "приход" или "списание"
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Transactions",
    timestamps: true,
  },
);

export default Transaction;
