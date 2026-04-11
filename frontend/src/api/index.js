import axios from "axios";

const api = axios.create({
  // Пока мы на своем компе, используем localhost.
  // Когда перенесем на сервер, поменяем на 10.80.53.4
  baseURL: "http://localhost:3000/api/v1",
});

export default api;
