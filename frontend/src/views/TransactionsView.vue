<template>
  <div>
    <h1 class="text-3xl font-bold text-slate-800 mb-6">История действий</h1>
    <div
      class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
    >
      <table class="w-full text-left">
        <thead class="bg-slate-50 border-b">
          <tr>
            <th class="px-6 py-4">Дата</th>
            <th class="px-6 py-4">Запчасть</th>
            <th class="px-6 py-4">Автомобиль</th>
            <th class="px-6 py-4">Кол-во</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in transactions" :key="t.id" class="border-b">
            <td class="px-6 py-4 text-sm">
              {{ new Date(t.createdAt).toLocaleString() }}
            </td>
            <td class="px-6 py-4 font-medium">{{ t.Part?.name }}</td>
            <td class="px-6 py-4">{{ t.Car?.number }} ({{ t.Car?.model }})</td>
            <td class="px-6 py-4 text-red-600 font-bold">
              - {{ t.quantity }} шт.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { inventoryApi } from "../api/inventory";

const transactions = ref([]);

onMounted(async () => {
  const res = await inventoryApi.getAllTransactions();
  transactions.value = res.data;
});
</script>
