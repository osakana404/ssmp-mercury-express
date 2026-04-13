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
            <th class="px-4 py-3 font-semibold text-slate-700">Действие</th>
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

            <!-- Запчасть -->
            <td class="px-4 py-4">
              <div class="font-semibold text-slate-900">
                {{ item.Part.name }}
              </div>
              <div class="text-xs text-slate-500">
                {{ item.Part.description || "-" }}
              </div>
            </td>

            <!-- Машина (только списания) -->
            <td class="px-4 py-4">
              <div
                v-if="item.type === 'spisanie' && item.Car"
                class="space-y-1"
              >
                <div class="font-semibold text-slate-900">
                  {{ item.Car.model }}
                </div>
                <div class="text-sm font-mono text-slate-700">
                  {{ item.Car.number }}
                </div>
              </div>
              <div v-else class="text-slate-400 italic text-sm">—</div>
            </td>

            <!-- Количество -->
            <td class="px-4 py-4">
              <span
                :class="[
                  'inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold',
                  item.type === 'prihod'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800',
                ]"
              >
                {{ item.quantity }}
              </span>
            </td>

            <!-- ✅ НОВЫЙ СТОЛБЕЦ: Действие -->
            <td class="px-4 py-4">
              <span
                class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
                :class="
                  item.action === 'create'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-slate-100 text-slate-700'
                "
              >
                <svg
                  v-if="item.action === 'create'"
                  class="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ item.action === "create" ? "Создал" : "Пополнил" }}
              </span>
            </td>

            <!-- Тип -->
            <td class="px-4 py-4">
              <span
                :class="[
                  'inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold',
                  item.type === 'prihod'
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-red-100 text-red-800 border border-red-200',
                ]"
              >
                {{ item.type === "prihod" ? "📥 Приход" : "🚗 Списание" }}
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
