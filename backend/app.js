import express from "express";
import "dotenv/config";
import { sequelize } from "./src/config/db.js";
import { News, Category, Files } from "./src/models/associations.js";

const PORT = process.env.PORT || 3000;
const app = express();

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

app.post("/categories", async (req, res) => {
  try {
    const category = await Category.create({ name: req.body.name });
    res.status(201).json(category);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/news", async (req, res) => {
  try {
    // Жадная загрузка: тянем новость ВМЕСТЕ с категорией
    const news = await News.findAll({
      include: [{ model: Category }, { model: Files }],
    });
    res.json(news);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// создать новость
app.post("/news", async (req, res) => {
  const { newsTitle, newsContent, newsCategory, assets } = req.body;

  if (!newsTitle) {
    return res.status(400).json({ message: "Ошибка тайтл пуст" });
  }

  try {
    await News.create(
      {
        title: newsTitle,
        content: newsContent,
        categoryId: newsCategory,
        Files: assets,
      },
      {
        include: [Files], // ГОВОРИМ SEQUELIZE: "Смотри внутрь и создавай вложенные файлы!"
      },
    );

    return res.status(201).json({ message: "Successfully created!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
