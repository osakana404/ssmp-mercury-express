import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/parts",
    component: () => import("../views/PartsView.vue"),
  },
  {
    path: "/supplies",
    component: () => import("../views/SuppliesView.vue"),
  },
  {
    path: "/disburse",
    component: () => import("../views/DisburseView.vue"),
  },
  {
    path: "/transactions",
    component: () => import("../views/TransactionsView.vue"),
  },
  {
    path: "/reports",
    component: () => import("../views/ReportsView.vue"),
  },
  {
    path: "/settings",
    component: () => import("../views/SettingsView.vue"),
  },
  {
    path: "/batches",
    name: "batches",
    component: () => import("../views/BatchesView.vue"),
  },
  {
    path: "/:pathMatch(.*)*", // Регулярка для отлова всех путей, которых нет выше
    name: "NotFound",
    component: () => import("../views/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
