import News from "./News.js";
import Category from "./Category.js";
import Files from "./Files.js";
import Part from "./part.js";
import Transaction from "./transaction.js";
import Car from "./car.js";
import Supplier from "./supplier.js";
import Supply from "./supply.js";
import Batch from "./batch.js";
import PartCategory from "./partcategory.js";

// Связь Категория -> Запчасти
PartCategory.hasMany(Part, { foreignKey: "categoryId", as: "parts" });
Part.belongsTo(PartCategory, { foreignKey: "categoryId", as: "category" });

// --- Контент (Новости и Категории) ---
Category.hasMany(News, { foreignKey: "categoryId" });
News.belongsTo(Category, { foreignKey: "categoryId" });

News.hasMany(Files, { foreignKey: "newsId" });
Files.belongsTo(News, { foreignKey: "newsId" });

// --- Склад и Транзакции (Старая логика) ---
Part.hasMany(Transaction, { foreignKey: "partId" });
Transaction.belongsTo(Part, { foreignKey: "partId", as: "Part" });

Car.hasMany(Transaction, { foreignKey: "carId" });
Transaction.belongsTo(Car, { foreignKey: "carId", as: "Car" });

// --- Поставки и Партионный учет (Новая логика) ---

// Поставщик -> Поставки (Накладные)
Supplier.hasMany(Supply, { foreignKey: "supplierId", as: "supplies" });
Supply.belongsTo(Supplier, { foreignKey: "supplierId", as: "supplier" });

// Поставка (Накладная) -> Партии
Supply.hasMany(Batch, { foreignKey: "supplyId", as: "batches" });
Batch.belongsTo(Supply, { foreignKey: "supplyId", as: "supply" });

// Запчасть -> Партии
Part.hasMany(Batch, { foreignKey: "partId", as: "batches" });
Batch.belongsTo(Part, { foreignKey: "partId", as: "part" });

// Экспортируем все модели, чтобы импортировать их одной строкой в контроллерах
export {
  News,
  Category,
  Files,
  Part,
  Car,
  Transaction,
  Supplier,
  Supply,
  Batch,
  PartCategory,
};
