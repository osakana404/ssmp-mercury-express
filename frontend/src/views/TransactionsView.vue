<template>
  <div class="space-y-6">
    <div class="flex justify-between items-end">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">Журнал операций</h1>
        <p class="text-slate-500 text-sm">Полная история движений по складу</p>
      </div>

      <div class="relative w-80">
        <span
          class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400"
        >
          🔍
        </span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Поиск по запчасти, авто или накладной..."
          class="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
        />
      </div>
    </div>

    <div
      class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
    >
      <table class="w-full text-left border-collapse">
        <thead class="bg-slate-50 border-b border-slate-200">
          <tr
            class="text-[10px] font-bold text-slate-500 uppercase tracking-wider"
          >
            <th class="px-6 py-4">Дата и время</th>
            <th class="px-6 py-4">Тип</th>
            <th class="px-6 py-4">Запчасть</th>
            <th class="px-6 py-4">Источник / Назначение</th>
            <th class="px-6 py-4">Кол-во</th>
            <th class="px-6 py-4 text-right">Сумма</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr
            v-for="t in filteredTransactions"
            :key="t.id"
            class="hover:bg-slate-50/50 transition"
          >
            <td
              class="px-6 py-4 text-sm text-slate-600 whitespace-nowrap font-medium"
            >
              {{ formatFullDate(t.date) }}
            </td>

            <td class="px-6 py-4">
              <span
                :class="
                  t.type === 'приход'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-rose-100 text-rose-700'
                "
                class="px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter"
              >
                {{ t.type }}
              </span>
            </td>

            <td class="px-6 py-4">
              <div class="font-bold text-slate-800">
                {{ t.Part?.name || "Н/Д" }}
              </div>
              <div v-if="t.comment" class="text-[10px] text-slate-400 italic">
                {{ t.comment }}
              </div>
            </td>

            <td class="px-6 py-4 text-sm">
              <div v-if="t.type === 'приход'" class="flex items-center gap-2">
                <span class="text-slate-400">📦 Накл:</span>
                <span class="font-mono font-bold text-blue-600">
                  {{ t.supply?.docNumber || "Б/Н" }}
                </span>
              </div>
              <div v-else class="flex items-center gap-2">
                <span class="text-slate-400">🚗 Авто:</span>
                <span class="font-bold text-amber-600 uppercase">
                  {{ t.Car ? `${t.Car.number}` : "—" }}
                </span>
                <span class="text-[10px] text-slate-400"
                  >({{ t.Car?.model || "?" }})</span
                >
              </div>
            </td>

            <td class="px-6 py-4">
              <span
                class="font-black"
                :class="
                  t.type === 'списание' ? 'text-rose-500' : 'text-emerald-500'
                "
              >
                {{ t.type === "списание" ? "-" : "+" }}{{ t.quantity }}
              </span>
              <span class="text-[10px] text-slate-400 ml-1">шт.</span>
            </td>

            <td class="px-6 py-4 text-right">
              <div class="font-black text-slate-900">
                {{ t.sum?.toLocaleString() }} ₽
              </div>
              <div class="text-[10px] text-slate-400">
                {{ t.price?.toLocaleString() }} ₽ / ед.
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredTransactions.length === 0" class="py-24 text-center">
        <div class="text-4xl mb-2">🕵️‍♂️</div>
        <div class="text-slate-400 font-medium">Транзакции не найдены</div>
        <div class="text-slate-300 text-xs mt-1">
          Попробуйте изменить параметры поиска
        </div>
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

const formatFullDate = (d) => {
  return new Date(d).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const filteredTransactions = computed(() => {
  if (!searchQuery.value) return transactions.value;
  const s = searchQuery.value.toLowerCase();
  return transactions.value.filter(
    (t) =>
      t.Part?.name?.toLowerCase().includes(s) ||
      t.Car?.number?.toLowerCase().includes(s) ||
      t.Car?.model?.toLowerCase().includes(s) ||
      t.supply?.docNumber?.toLowerCase().includes(s) ||
      t.comment?.toLowerCase().includes(s),
  );
});

onMounted(loadTransactions);
</script>
