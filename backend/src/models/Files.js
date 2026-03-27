import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Files = sequelize.define(
  "Files",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    newsId: {
      type: DataTypes.INTEGER,
      foreignKey: true,
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    freezeTableName: true, // не множить имя модели
    timestamps: true,
  },
);

export default Files;
