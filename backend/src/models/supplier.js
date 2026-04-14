import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Supplier = sequelize.define(
  "Supplier",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false, // Название компании обязательно
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true, // Проверка на корректность почты
      },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    inn: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true, // ИНН должен быть уникальным
    },
  },
  {
    tableName: "Suppliers",
    timestamps: true, // Добавит createdAt и updatedAt
  },
);

export default Supplier;
