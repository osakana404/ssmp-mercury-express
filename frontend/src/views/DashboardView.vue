<template>
  <div class="space-y-6">
    <h1 class="text-3xl font-bold text-slate-800">Рабочий стол</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <p class="text-slate-500 text-sm font-medium">Всего позиций</p>
        <p class="text-3xl font-bold text-slate-900">{{ parts.length }}</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <p class="text-slate-500 text-sm font-medium">Активных партий</p>
        <p class="text-3xl font-bold text-blue-600">{{ activeBatchesCount }}</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <p class="text-slate-500 text-sm font-medium">Последние действия</p>
        <p class="text-3xl font-bold text-green-600">{{ transactionsCount }}</p>
      </div>
    </div>

    <div class="bg-blue-50 border border-blue-100 p-6 rounded-xl">
      <h2 class="text-blue-800 font-bold mb-2">
        Добро пожаловать в систему Mercury
      </h2>
      <p class="text-blue-600 text-sm">
        Используйте боковое меню для навигации между запчастями, партиями и
        историей списаний.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { inventoryApi } from "../api/inventory";

const parts = ref([]);
const activeBatchesCount = ref(0);
const transactionsCount = ref(0);

onMounted(async () => {
  const [p, b, t] = await Promise.all([
    inventoryApi.getParts(),
    inventoryApi.getActiveBatches(),
    inventoryApi.getAllTransactions(),
  ]);
  parts.value = p.data;
  activeBatchesCount.value = b.data.length;
  transactionsCount.value = t.data.length;
});
</script>
