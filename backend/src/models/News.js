import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const News = sequelize.define(
  "News",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
  },
  {
    // 2-й аргумент: Опции модели
    freezeTableName: true, // Теперь таблица в БД будет называться "News", а не "News" (Sequelize не будет добавлять 's' в конце)
    timestamps: true, // Добавит поля createdAt и updatedAt (советую оставить для АСУ)
  },
);

// `sequelize.define` also returns the model
// console.log(News === sequelize.models.News); true

export default News;
