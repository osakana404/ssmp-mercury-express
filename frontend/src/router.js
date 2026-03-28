import { createRouter, createWebHistory } from "vue-router";
import NewsList from "./components/NewsList.vue";
import NewsDetail from "./components/NewsDetail.vue";

const routes = [
  { path: "/", component: NewsList }, // Главная со списком
  { path: "/news/:id", component: NewsDetail, props: true }, // Страница одной новости
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
