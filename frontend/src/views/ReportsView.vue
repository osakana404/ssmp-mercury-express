<template>
  <div class="space-y-8">
    <h1 class="text-3xl font-bold text-slate-800">Финансовая аналитика</h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div
        class="lg:col-span-1 bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-2xl text-white shadow-lg"
      >
        <p class="text-blue-100 text-sm font-medium uppercase tracking-wider">
          Общая стоимость склада
        </p>
        <p class="text-4xl font-black mt-2">
          {{ storeValue.toLocaleString() }} ₽
        </p>
        <div class="mt-4 text-blue-200 text-xs italic">
          * Расчет на основе активных партий (FIFO)
        </div>
      </div>

      <div
        class="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
      >
        <h3 class="font-bold text-slate-700 mb-4">Ценность по позициям</h3>
        <div class="max-h-60 overflow-y-auto">
          <table class="w-full text-sm">
            <thead class="sticky top-0 bg-white border-b">
              <tr class="text-slate-500">
                <th class="py-2 text-left">Запчасть</th>
                <th class="py-2 text-right">Кол-во</th>
                <th class="py-2 text-right">Стоимость</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in inventoryParts"
                :key="item.id"
                class="border-b border-slate-50"
              >
                <td class="py-2">{{ item.name }}</td>
                <td class="py-2 text-right text-slate-500">
                  {{ item.quantity }} шт.
                </td>
                <td class="py-2 text-right font-semibold">
                  {{ Number(item.totalValue || 0).toLocaleString() }} ₽
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
      >
        <div>
          <h2 class="text-xl font-bold text-slate-800">
            Расходы на автомобиль
          </h2>
          <p class="text-slate-500 text-sm">
            Выберите машину, чтобы увидеть историю затрат
          </p>
        </div>
        <select
          v-model="selectedCarId"
          @change="loadCarReport"
          class="bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option :value="null" disabled>-- Выберите авто --</option>
          <option v-for="car in cars" :key="car.id" :value="car.id">
            {{ car.number }} ({{ car.model }})
          </option>
        </select>
      </div>

      <div v-if="carReport" class="space-y-6">
        <div
          class="flex items-center gap-4 p-4 bg-orange-50 border border-orange-100 rounded-xl"
        >
          <div class="bg-orange-500 text-white p-3 rounded-lg text-2xl">🚗</div>
          <div>
            <p class="text-sm text-orange-700 font-medium">
              Итого потрачено на {{ carReport.car.number }}:
            </p>
            <p class="text-2xl font-black text-orange-900">
              {{ carReport.totalSpent.toLocaleString() }} ₽
            </p>
          </div>
        </div>

        <table class="w-full text-left">
          <thead class="text-xs uppercase text-slate-400 font-bold border-b">
            <tr>
              <th class="pb-3">Дата</th>
              <th class="pb-3">Что заменили</th>
              <th class="pb-3 text-right">Сумма списания</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="log in carReport.history"
              :key="log.id"
              class="border-b last:border-0"
            >
              <td class="py-4 text-sm text-slate-500">
                {{ new Date(log.date).toLocaleDateString() }}
              </td>
              <td class="py-4 font-medium">{{ log.Part?.name }}</td>
              <td class="py-4 text-right font-bold text-slate-700">
                {{ log.sum.toLocaleString() }} ₽
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-else-if="selectedCarId"
        class="text-center py-10 text-slate-400 italic"
      >
        Загрузка данных по автомобилю...
      </div>
      <div
        v-else
        class="text-center py-10 text-slate-300 border-2 border-dashed rounded-xl"
      >
        Ничего не выбрано
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { inventoryApi } from "../api/inventory";

const storeValue = ref(0);
const inventoryParts = ref([]);
const cars = ref([]);
const selectedCarId = ref(null);
const carReport = ref(null);

const loadBaseData = async () => {
  try {
    const [inv, cRes] = await Promise.all([
      inventoryApi.getInventoryReport(),
      inventoryApi.getCars(),
    ]);
    storeValue.ref = inv.data.totalStoreValue;
    inventoryParts.value = inv.data.parts;
    cars.value = cRes.data;
  } catch (e) {
    console.error(e);
  }
};

const loadCarReport = async () => {
  if (!selectedCarId.value) return;
  try {
    const res = await inventoryApi.getCarReport(selectedCarId.value);
    carReport.value = res.data;
  } catch (e) {
    alert("Ошибка загрузки отчета по машине");
  }
};

onMounted(loadBaseData);
</script>
