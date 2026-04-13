import api from "./index";

export const getParts = () => api.get("/parts");
export const createPrihod = (payload) => api.post("/parts/prihod", payload);
export const createSpisanie = (payload) => api.post("/parts/spisanie", payload);
export const getCars = () => api.get("/cars");
