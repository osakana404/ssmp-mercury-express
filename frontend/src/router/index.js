import { createRouter, createWebHistory } from "vue-router";
import DashboardView from "../views/DashboardView.vue";
import PartsView from "../views/PartsView.vue"; // Твой код со складом
import BatchesView from "../views/BatchesView.vue";
import TransactionsView from "../views/TransactionsView.vue";

const routes = [
  { path: "/", name: "dashboard", component: DashboardView },
  { path: "/parts", name: "parts", component: PartsView },
  { path: "/batches", name: "batches", component: BatchesView },
  { path: "/transactions", name: "transactions", component: TransactionsView },
  {
    path: "/reports",
    name: "reports",
    component: () => import("../views/ReportsView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
