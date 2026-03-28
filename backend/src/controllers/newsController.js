import { News, Category, Files } from "../models/associations.js";

export async function getAllNews(req, res, next) {
  try {
    const result = await News.findAll({
      include: [Category, Files],
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
    const { title, content, categoryId, assets } = req.body;
    if (!title || !content || !categoryId) {
      return res
        .status(401)
        .json({ message: "Заполните все необходимые поля" });
    }
    await News.create(
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
    res.status(201).json({ message: "Новость успешно добавлена" });
  } catch (error) {
    next(error);
  }
}
