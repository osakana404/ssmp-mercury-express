import express from "express";
import "dotenv/config";
import cors from "cors";
import { sequelize } from "./src/config/db.js";
import { newsRouter } from "./src/routes/newsRouter.js";
import multer from "multer";

import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { transactionRouter } from "./src/routes/transactionRouter.js";
import { partRouter } from "./src/routes/partRouter.js";
import { carRouter } from "./src/routes/carRouter.js";
import { supplierRouter } from "./src/routes/supplierRouter.js";
import { supplyRouter } from "./src/routes/supplyRouter.js";
import { categoryRouter } from "./src/routes/categoryRouter.js";
import { reportRouter } from "./src/routes/reportRouter.js";
import { batchRouter } from "./src/routes/batchRouter.js";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SSMP MERCURY",
      version: "1.0.0",
      description: "Меркурий ССМП",
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
        description: "Локальный сервер",
      },
    ],
  },
  // Пути к файлам, где пишем доку
  apis: ["./src/docs/*.yaml"], // Swagger ищет описание в отдельном файле
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

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
// На каком адресе будет висеть документация
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json()); // чтобы сервер понимал JSON в запросах

app.get("/", (req, res) => {
  res.status(200).json({ name: "Mercury" });
});

// роуты
app.use("/api/v1/news", newsRouter);
app.use("/api/v1/parts", partRouter);
app.use("/api/v1/transactions", transactionRouter);
app.use("/api/v1/cars", carRouter);
app.use("/api/v1/suppliers", supplierRouter);
app.use("/api/v1/supply", supplyRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/reports", reportRouter);
app.use("/api/v1/batches", batchRouter);

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
