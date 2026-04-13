import { createRouter, createWebHistory } from "vue-router";
import AppLayout from "@/layouts/AppLayout.vue";

const routes = [
  {
    path: "/",
    component: AppLayout,
    children: [
      {
        path: "",
        name: "dashboard",
        component: () => import("@/views/Dashboard.vue"),
      },

      {
        path: "news",
        name: "news.list",
        component: () => import("@/views/news/NewsList.vue"),
      },
      {
        path: "news/create",
        name: "news.create",
        component: () => import("@/views/news/NewsCreate.vue"),
      },
      {
        path: "news/:id",
        name: "news.detail",
        component: () => import("@/views/news/NewsDetail.vue"),
        props: true,
      },

      {
        path: "parts",
        name: "parts.list",
        component: () => import("@/views/parts/PartsList.vue"),
      },
      {
        path: "parts/prihod",
        name: "parts.prihod",
        component: () => import("@/views/parts/PartPrihod.vue"),
      },
      {
        path: "parts/spisanie",
        name: "parts.spisanie",
        component: () => import("@/views/parts/PartSpisanie.vue"),
      },

      {
        path: "transactions",
        name: "transactions.list",
        component: () => import("@/views/transactions/TransactionsList.vue"),
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("@/views/NotFound.vue"),
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
