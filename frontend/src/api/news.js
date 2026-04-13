import api from "./index";

export const getNews = () => api.get("/news");
export const getNewsById = (id) => api.get(`/news/${id}`);

export const createNews = (payload) => {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("content", payload.content);
  formData.append("categoryId", payload.categoryId);

  if (payload.files?.length) {
    payload.files.forEach((file) => formData.append("files", file));
  }

  return api.post("/news", formData);
};
