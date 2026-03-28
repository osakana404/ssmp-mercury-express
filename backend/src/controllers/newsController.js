import { News, Category, Files } from "../models/associations.js";

export async function getAllNews(req, res, next) {
  try {
    const result = await News.findAll({
      include: [
        Category,
        {
          model: Files,
          separate: true,
          order: [["priority", "ASC"]], // сортировка по приоритету
        },
      ],
      // ДОБАВЬ ЭТО: Сортировка самих новостей по дате создания (от новых к старым)
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getSingleNews(req, res, next) {
  try {
    const id = req.params.id;
    const result = await News.findByPk(id, {
      include: [Category, Files],
    });
    if (!result) {
      return res.status(404).json({ message: "Not Found" });
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function createNews(req, res, next) {
  try {
    const { title, content, categoryId } = req.body;

    // Получаем пути к файлам, которые Multer сохранил на диск
    const assets = req.files.map((file, index) => ({
      // req.protocol (http/https) + host (ip:port)
      url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
      type: file.mimetype.startsWith("image") ? "image" : "video",
      priority: index,
    }));

    if (!title || !content || !categoryId) {
      return res
        .status(401)
        .json({ message: "Заполните все необходимые поля" });
    }
    const newRecord = await News.create(
      {
        title: title,
        content: content,
        categoryId: categoryId,
        Files: assets,
      },
      {
        include: [Files],
      },
    );
    res
      .status(201)
      .json({ message: "Новость успешно добавлена", data: newRecord });
  } catch (error) {
    next(error);
  }
}
