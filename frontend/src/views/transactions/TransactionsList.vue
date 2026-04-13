<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold">Журнал движений</h2>
    </div>

    <div class="bg-white rounded-xl shadow overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-slate-50 border-b">
          <tr>
            <th class="px-4 py-3 font-semibold text-slate-700">ID</th>
            <th class="px-4 py-3 font-semibold text-slate-700">Запчасть</th>
            <th class="px-4 py-3 font-semibold text-slate-700">Машина</th>
            <th class="px-4 py-3 font-semibold text-slate-700">Кол-во</th>
            <th class="px-4 py-3 font-semibold text-slate-700">Тип</th>
            <th class="px-4 py-3 font-semibold text-slate-700">Цена</th>
            <th class="px-4 py-3 font-semibold text-slate-700">Дата</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in sortedTransactions"
            :key="item.id"
            class="border-b last:border-b-0 hover:bg-slate-50 transition-colors"
          >
            <!-- ID -->
            <td class="px-4 py-4 font-mono text-sm text-slate-900">
              #{{ item.id }}
            </td>

            <!-- Запчасть (всегда есть) -->
            <td class="px-4 py-4">
              <div class="font-semibold text-slate-900">
                {{ item.Part.name }}
              </div>
              <div class="text-xs text-slate-500">
                {{ item.Part.description || "-" }}
              </div>
            </td>

            <!-- Машина (только для списаний) -->
            <td class="px-4 py-4">
              <div
                v-if="item.type === 'списание' && item.Car"
                class="space-y-1"
              >
                <div class="font-semibold text-slate-900">
                  {{ item.Car.model }}
                </div>
                <div class="text-sm font-mono text-slate-700">
                  {{ item.Car.number }}
                </div>
                <div class="text-xs text-slate-500">
                  {{ item.Car.description }}
                </div>
              </div>
              <div v-else class="text-slate-400 italic text-sm">
                <span v-if="item.type === 'приход'">—</span>
                <span v-else class="text-slate-500">Нет данных</span>
              </div>
            </td>

            <!-- Количество -->
            <td class="px-4 py-4">
              <span
                :class="[
                  'inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold',
                  item.type === 'приход'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800',
                ]"
              >
                {{ item.quantity }}
              </span>
            </td>

            <!-- Тип -->
            <td class="px-4 py-4">
              <span
                :class="[
                  'inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold',
                  item.type === 'приход'
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-red-100 text-red-800 border border-red-200',
                ]"
              >
                {{ item.type === "приход" ? "📥 Приход" : "🚗 Списание" }}
              </span>
            </td>

            <!-- Цена -->
            <td class="px-4 py-4 font-mono text-lg font-bold text-slate-900">
              {{ formatPrice(item.price) }}
            </td>

            <!-- Дата -->
            <td class="px-4 py-4 text-sm text-slate-600">
              {{ formatDate(item.date) }}
              <div class="text-xs text-slate-400">
                {{ formatTime(item.createdAt) }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "@/api";

const transactions = ref([]);

const sortedTransactions = computed(() => {
  return [...transactions.value].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
  }).format(price);
};

onMounted(async () => {
  try {
    const { data } = await api.get("/transactions");
    transactions.value = data;
  } catch (error) {
    console.error("Ошибка загрузки транзакций:", error);
  }
});
</script>
