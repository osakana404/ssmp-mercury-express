import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const News = sequelize.define(
  "News",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // новое поле
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    freezeTableName: true, // не множить имя модели
    timestamps: true,
  },
);

export default News;
