import express from "express";
import "dotenv/config";
import cors from "cors";
import { sequelize } from "./src/config/db.js";
import { newsRouter } from "./src/routes/newsRouter.js";
import multer from "multer";

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors()); // всё разрешено

app.use("/uploads", express.static("uploads"));

// Проверка подключения к базе при старте
try {
  await sequelize.authenticate();
  console.log("- База данных SQLite подключена успешно.");
} catch (error) {
  console.error("- Ошибка подключения к БД:", error);
}

app.use(express.json()); // чтобы сервер понимал JSON в запросах

app.get("/", (req, res) => {
  res.status(200).json({ name: "Mercury" });
});

// роуты
app.use("/api/v1/news", newsRouter);

// Правильный единый обработчик ошибок
app.use((err, req, res, next) => {
  console.error("КРИТИЧЕСКАЯ ОШИБКА:", err.message);

  // Сначала проверяем, не от Multer ли пришла ошибка
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "Файл слишком большой! Максимум 5 МБ" });
    }
    return res.status(400).json({ message: `Ошибка загрузки: ${err.message}` });
  }

  // Если это наша ошибка валидации или что-то еще
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Внутренняя ошибка сервера",
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
