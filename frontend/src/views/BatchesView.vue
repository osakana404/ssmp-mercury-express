<template>
  <div>
    <h1 class="text-3xl font-bold text-slate-800 mb-6">Партии на складе</h1>
    <div
      class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
    >
      <table class="w-full text-left">
        <thead
          class="bg-slate-50 border-b text-xs uppercase font-bold text-slate-500"
        >
          <tr>
            <th class="px-6 py-4">Запчасть</th>
            <th class="px-6 py-4">Остаток в партии</th>
            <th class="px-6 py-4">Цена закуп.</th>
            <th class="px-6 py-4">Накладная / Поставщик</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="b in batches" :key="b.id">
            <td class="px-6 py-4 font-bold">{{ b.part?.name }}</td>
            <td class="px-6 py-4">{{ b.currentQuantity }} шт.</td>
            <td class="px-6 py-4 text-green-600 font-medium">
              {{ b.price }} ₽
            </td>
            <td class="px-6 py-4 text-sm">
              {{ b.supply?.docNumber }} <br />
              <span class="text-slate-400">{{ b.supply?.supplier?.name }}</span>
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

const batches = ref([]);

onMounted(async () => {
  const res = await inventoryApi.getActiveBatches();
  batches.value = res.data;
});
</script>
