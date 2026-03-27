import News from "./News.js";
import Category from "./Category.js";
import Files from "./Files.js";

// от родителя к детям
Category.hasMany(News, { foreignKey: "categoryId" });
// от детей к родителям belongsTo - "принадлежит к"
News.belongsTo(Category, { foreignKey: "categoryId" });

News.hasMany(Files, { foreignKey: "newsId" });
Files.belongsTo(News, { foreignKey: "newsId" });

export { News, Category, Files };
