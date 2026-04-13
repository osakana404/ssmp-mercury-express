<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">Транзакции</h2>

    <div class="bg-white rounded-xl shadow overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-slate-50 border-b">
          <tr>
            <th class="px-4 py-3">ID</th>
            <th class="px-4 py-3">Запчасть</th>
            <th class="px-4 py-3">Машина</th>
            <th class="px-4 py-3">Кол-во</th>
            <th class="px-4 py-3">Тип</th>
            <th class="px-4 py-3">Цена</th>
            <th class="px-4 py-3">Дата</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in transactions"
            :key="item.id"
            class="border-b hover:bg-slate-50"
          >
            <td class="px-4 py-3">{{ item.id }}</td>
            <td class="px-4 py-3">
              {{ item.Part?.name || "Неизвестная запчасть" }}
            </td>
            <td class="px-4 py-3">
              {{ item.Car?.name || "Неизвестная машина" }}
            </td>
            <td class="px-4 py-3">{{ item.quantity }}</td>
            <td class="px-4 py-3">{{ item.type }}</td>
            <td class="px-4 py-3">{{ item.price }}</td>
            <td class="px-4 py-3">{{ formatDate(item.date) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/api";

const transactions = ref([]);
const partsMap = ref({});
const carsMap = ref({});

const formatDate = (date) => new Date(date).toLocaleString("ru-RU");

onMounted(async () => {
  const [transactionsRes, partsRes, carsRes] = await Promise.all([
    api.get("/transactions"),
    api.get("/parts"),
    // api.get("/cars"),
  ]);

  transactions.value = transactionsRes.data || [];

  partsMap.value = (partsRes.data || []).reduce((acc, part) => {
    acc[part.id] = part.name;
    return acc;
  }, {});

  carsMap.value = (carsRes.data || []).reduce((acc, car) => {
    acc[car.id] = car.name;
    return acc;
  }, {});
});
</script>
