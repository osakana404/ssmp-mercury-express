import express from "express";
import "dotenv/config";
import cors from "cors";
import { sequelize } from "./src/config/db.js";
import { News, Category, Files } from "./src/models/associations.js";
import { newsRouter } from "./src/routes/newsRouter.js";

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
// Проверка подключения к базе при старте
try {
  await sequelize.authenticate();
  console.log("- База данных SQLite подключена успешно.");
} catch (error) {
  console.error("- Ошибка подключения к БД:", error);
}

app.use(express.json()); // Чтобы сервер понимал JSON в запросах

app.get("/", (req, res) => {
  res.send("hello");
});

// роуты
app.use("/api/v1/news", newsRouter);

// обработчик ошибок из next(error)
app.use((err, req, res, next) => {
  console.error("КРИТИЧЕСКАЯ ОШИБКА:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Внутренняя ошибка сервера",
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
