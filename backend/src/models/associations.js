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

// --- Категории и запчасти ---
PartCategory.hasMany(Part, { foreignKey: "categoryId", as: "parts" });
Part.belongsTo(PartCategory, { foreignKey: "categoryId", as: "category" });

// --- Контент (Новости) ---
Category.hasMany(News, { foreignKey: "categoryId" });
News.belongsTo(Category, { foreignKey: "categoryId" });

News.hasMany(Files, { foreignKey: "newsId" });
Files.belongsTo(News, { foreignKey: "newsId" });

// --- Поставки и Партионный учет ---

// Поставщик -> Накладные
Supplier.hasMany(Supply, { foreignKey: "supplierId", as: "supplies" });
Supply.belongsTo(Supplier, { foreignKey: "supplierId", as: "supplier" });

// Накладная -> Партии
Supply.hasMany(Batch, { foreignKey: "supplyId", as: "batches" });
Batch.belongsTo(Supply, { foreignKey: "supplyId", as: "supply" });

// Запчасть -> Партии
Part.hasMany(Batch, { foreignKey: "partId", as: "batches" });
Batch.belongsTo(Part, { foreignKey: "partId", as: "part" });

// --- Транзакции (Журнал операций) ---

// Транзакция -> Запчасть
Part.hasMany(Transaction, { foreignKey: "partId" });
Transaction.belongsTo(Part, { foreignKey: "partId", as: "Part" });

// Транзакция -> Машина (для списаний)
Car.hasMany(Transaction, { foreignKey: "carId" });
Transaction.belongsTo(Car, { foreignKey: "carId", as: "Car" });

// ИСПРАВЛЕНИЕ: Транзакция -> Накладная (для приходов)
// Именно этой связи не хватало для работы твоего контроллера
Supply.hasMany(Transaction, { foreignKey: "supplyId", as: "transactions" });
Transaction.belongsTo(Supply, { foreignKey: "supplyId", as: "supply" });

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
