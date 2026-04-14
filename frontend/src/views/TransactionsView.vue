<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">Журнал операций</h1>
        <p class="text-slate-500 text-sm">Полная история движений по складу</p>
      </div>

      <div class="flex gap-2">
        <input
          v-model="searchQuery"
          placeholder="Поиск по запчасти или авто..."
          class="px-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <div
      class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
    >
      <table class="w-full text-left border-collapse">
        <thead class="bg-slate-50 border-b border-slate-200">
          <tr>
            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
              Дата
            </th>
            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
              Тип
            </th>
            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
              Запчасть
            </th>
            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
              Источник / Назначение
            </th>
            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
              Кол-во
            </th>
            <th
              class="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right"
            >
              Сумма
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr
            v-for="t in filteredTransactions"
            :key="t.id"
            class="hover:bg-slate-50/50 transition"
          >
            <td class="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
              {{
                new Date(t.date).toLocaleString("ru-RU", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }}
            </td>

            <td class="px-6 py-4">
              <span
                :class="
                  t.type === 'приход'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                "
                class="px-2.5 py-1 rounded-md text-[10px] font-black uppercase"
              >
                {{ t.type }}
              </span>
            </td>

            <td class="px-6 py-4">
              <div class="font-bold text-slate-800">{{ t.Part?.name }}</div>
              <div v-if="t.comment" class="text-xs text-slate-400 italic">
                {{ t.comment }}
              </div>
            </td>

            <td class="px-6 py-4 text-sm">
              <div v-if="t.type === 'приход'" class="flex items-center gap-2">
                <span class="text-slate-400">📦 Накл:</span>
                <span class="font-medium text-blue-600">{{
                  t.supply?.docNumber || "—"
                }}</span>
              </div>
              <div v-else class="flex items-center gap-2">
                <span class="text-slate-400">🚗 Авто:</span>
                <span class="font-medium text-orange-600">
                  {{ t.Car ? `${t.Car.number} (${t.Car.model})` : "—" }}
                </span>
              </div>
            </td>

            <td class="px-6 py-4 font-bold text-slate-700">
              {{ t.type === "списание" ? "-" : "+" }}{{ t.quantity }} шт.
            </td>

            <td class="px-6 py-4 text-right">
              <div class="font-bold text-slate-900">
                {{ t.sum.toLocaleString() }} ₽
              </div>
              <div class="text-[10px] text-slate-400">
                {{ t.price.toLocaleString() }} ₽ / ед.
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div
        v-if="filteredTransactions.length === 0"
        class="py-20 text-center text-slate-400"
      >
        Транзакции не найдены
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { inventoryApi } from "../api/inventory";

const transactions = ref([]);
const searchQuery = ref("");

const loadTransactions = async () => {
  try {
    const res = await inventoryApi.getAllTransactions();
    transactions.value = res.data;
  } catch (e) {
    console.error("Ошибка загрузки транзакций:", e);
  }
};

const filteredTransactions = computed(() => {
  if (!searchQuery.value) return transactions.value;
  const s = searchQuery.value.toLowerCase();
  return transactions.value.filter(
    (t) =>
      t.Part?.name?.toLowerCase().includes(s) ||
      t.Car?.number?.toLowerCase().includes(s) ||
      t.Car?.model?.toLowerCase().includes(s) ||
      t.supply?.docNumber?.toLowerCase().includes(s),
  );
});

onMounted(loadTransactions);
</script>
