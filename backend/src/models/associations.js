import News from "./News.js";
import Category from "./Category.js";
import Files from "./Files.js";
import Part from "./part.js";
import Transaction from "./transaction.js";
import Car from "./car.js";

// от родителя к детям
Category.hasMany(News, { foreignKey: "categoryId" });
// от детей к родителям belongsTo - "принадлежит к"
News.belongsTo(Category, { foreignKey: "categoryId" });

News.hasMany(Files, { foreignKey: "newsId" });
Files.belongsTo(News, { foreignKey: "newsId" });

// Связь с Запчастями
Part.hasMany(Transaction, { foreignKey: "partId" });
Transaction.belongsTo(Part, { foreignKey: "partId", as: "Part" });

// Связь с Машинами
Car.hasMany(Transaction, { foreignKey: "carId" });
Transaction.belongsTo(Car, { foreignKey: "carId", as: "Car" });

export { News, Category, Files, Part, Car, Transaction };
