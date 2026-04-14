import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
});

export const inventoryApi = {
  // Список запчастей
  getParts: () => api.get("/parts"),

  // Приход товара (ВАЖНО: путь /supply)
  createSupply: (data) => api.post("/supply", data),

  // Списание (FIFO)
  disbursePart: (data) => api.post("/parts/disburse", data),

  // ПАРТИИ
  getAllBatches: () => api.get("/batches"),
  getActiveBatches: () => api.get("/batches/active"),

  // ТРАНЗАКЦИИ (История списаний)
  getAllTransactions: () => api.get("/transactions"),

  // ОТЧЕТЫ
  getInventoryReport: () => api.get("/reports/inventory"),
  getCarReport: (carId) => api.get(`/reports/car/${carId}`),

  // Справочники для выпадающих списков
  getSuppliers: () => api.get("/suppliers"),
  getCars: () => api.get("/cars"),
};
