import News from "./News.js";
import Category from "./Category.js";

// от родителя к детям
Category.hasMany(News, { foreignKey: "categoryId" });
// от детей к родителям belongsTo - "принадлежит к"
News.belongsTo(Category, { foreignKey: "categoryId" });

export { News, Category };
