import axios from "axios";

const api = axios.create({
  // Убедись, что порт и префикс /api/v1 совпадают с настройками сервера
  baseURL: "http://localhost:3000/api/v1",
});

export const inventoryApi = {
  // Запчасти (Справочник)
  getParts: () => api.get("/parts"),
  createPart: (data) => api.post("/parts", data),
  updatePart: (id, data) => api.patch(`/parts/${id}`, data),
  deletePart: (id) => api.delete(`/parts/${id}`),

  // Приход (Накладные) — Проверь: supply или supplies?
  getSupplies: () => api.get("/supply"),
  createSupply: (data) => api.post("/supply", data),
  getSuppliers: () => api.get("/suppliers"),
  createSupplier: (data) => api.post("/suppliers", data),
  updateSupplier: (id, data) => api.patch(`/suppliers/${id}`, data),
  deleteSupplier: (id) => api.delete(`/suppliers/${id}`),

  // Списание (FIFO)
  disbursePart: (data) => api.post("/parts/disburse", data),

  // Машины (Полный CRUD)
  getCars: () => api.get("/cars"),
  createCar: (data) => api.post("/cars", data),
  updateCar: (id, data) => api.patch(`/cars/${id}`, data),
  deleteCar: (id) => api.delete(`/cars/${id}`),

  // Категории (Полный CRUD)
  getCategories: () => api.get("/categories"),
  createCategory: (data) => api.post("/categories", data),
  updateCategory: (id, data) => api.patch(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),

  // Журнал и Отчеты
  getAllTransactions: () => api.get("/transactions"),
  getInventoryReport: () => api.get("/reports/inventory"),
  getCarReport: (carId) => api.get(`/reports/car/${carId}`),

  getBatches: () => api.get("/batches"),
  getActiveBatches: () => api.get("/batches/active"),
  getBatchesByPart: (partId) => api.get(`/batches/part/${partId}`),
  updateBatch: (id, data) => api.patch(`/batches/${id}`, data),
};
