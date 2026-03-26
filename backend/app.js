import express from "express";
import "dotenv/config";
import { sequelize } from "./src/config/db.js";

import News from "./src/models/News.js";

const PORT = process.env.PORT || 3000;
const app = express();

// Проверка подключения к базе при старте
try {
  await sequelize.authenticate();
  console.log("- База данных SQLite подключена успешно.");

  // Автоматически создаем таблицы, если их нет
  // alter: true подправит таблицу, если ты добавишь новые поля в модели
  await sequelize.sync({ alter: true });
  console.log("- Модели синхронизированы.");
} catch (error) {
  console.error("- Ошибка подключения к БД:", error);
}

app.use(express.json()); // Чтобы сервер понимал JSON в запросах

app.get("/", (req, res) => {
  res.send("hello");
});

app.post("/news", async (req, res) => {
  try {
    const item = await News.create({
      title: "Открытие гаража",
      description: "Сегодня мы начинаем работу в новой системе!",
    });
    res.status(201).json(item);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
