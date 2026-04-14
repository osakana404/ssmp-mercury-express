<template>
  <div class="flex flex-col md:flex-row gap-6">
    <div class="w-full md:w-64 space-y-4">
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <h3 class="font-bold text-slate-800 mb-3 flex items-center gap-2">
          🔍 Фильтр деталей
        </h3>
        <div
          class="space-y-1 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar"
        >
          <button
            @click="selectedPartId = null"
            :class="
              !selectedPartId
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'text-slate-600 border-transparent hover:bg-slate-50'
            "
            class="w-full text-left px-3 py-2 rounded-lg text-xs font-medium border transition-all"
          >
            📦 Все запчасти
          </button>
          <button
            v-for="part in parts"
            :key="part.id"
            @click="selectedPartId = part.id"
            :class="
              selectedPartId === part.id
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'text-slate-600 border-transparent hover:bg-slate-50'
            "
            class="w-full text-left px-3 py-2 rounded-lg text-xs border transition-all flex justify-between items-center"
          >
            <span class="truncate mr-2">{{ part.name }}</span>
            <span
              class="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-400"
              >{{ part.quantity }}</span
            >
          </button>
        </div>
      </div>
    </div>

    <div class="flex-1 space-y-4">
      <div class="flex justify-between items-end">
        <div>
          <h1 class="text-3xl font-bold text-slate-800">Партии (Batches)</h1>
          <p class="text-slate-500 text-sm">
            {{
              selectedPartId
                ? `История закупок для выбранной детали`
                : "Полный список всех поступлений на склад"
            }}
          </p>
        </div>
        <div class="flex gap-2">
          <button
            @click="onlyActive = !onlyActive"
            :class="
              onlyActive
                ? 'bg-green-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200'
            "
            class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
          >
            {{ onlyActive ? "✅ Только в наличии" : "📂 Показать архив" }}
          </button>
        </div>
      </div>

      <div
        class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
      >
        <table class="w-full text-left border-collapse">
          <thead
            class="bg-slate-50 border-b text-[10px] font-bold text-slate-500 uppercase tracking-wider"
          >
            <tr>
              <th v-if="!selectedPartId" class="px-6 py-4">Запчасть</th>
              <th class="px-6 py-4">Документ</th>
              <th class="px-6 py-4">Дата</th>
              <th class="px-6 py-4">Цена зак.</th>
              <th class="px-6 py-4 text-center">Остаток в партии</th>
              <th class="px-6 py-4 text-center">Сумма</th>
              <th class="px-6 py-4 text-right">Статус</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-sm">
            <tr
              v-for="batch in filteredBatches"
              :key="batch.id"
              :class="batch.currentQuantity === 0 ? 'opacity-50 grayscale' : ''"
              class="hover:bg-slate-50/50 transition"
            >
              <td
                v-if="!selectedPartId"
                class="px-6 py-4 font-bold text-slate-700"
              >
                {{ batch.part?.name || "—" }}
              </td>

              <td class="px-6 py-4 font-mono text-xs text-blue-600">
                #{{ batch.supply?.docNumber || "б/н" }}
                <div class="text-[10px] text-slate-400 font-sans italic">
                  {{ batch.supply?.supplier?.name || "Поставщик не указан" }}
                </div>
              </td>

              <td class="px-6 py-4 text-slate-600 text-xs">
                {{ formatDate(batch.supply?.date) }}
              </td>

              <td class="px-6 py-4 font-bold text-slate-700">
                {{ batch.price.toLocaleString() }} ₽
              </td>

              <td class="px-6 py-4 text-center">
                <div
                  class="font-mono font-bold"
                  :class="
                    batch.currentQuantity > 0
                      ? 'text-blue-600'
                      : 'text-slate-400'
                  "
                >
                  {{ batch.currentQuantity }}
                  <span class="text-[10px] font-normal text-slate-400">шт</span>
                </div>
                <div
                  class="w-20 h-1 bg-slate-100 rounded-full mx-auto mt-1 overflow-hidden"
                >
                  <div
                    class="h-full bg-blue-400"
                    :style="{
                      width:
                        (batch.currentQuantity / batch.initialQuantity) * 100 +
                        '%',
                    }"
                  ></div>
                </div>
              </td>
              <td class="px-6 py-4 font-bold text-slate-700">
                {{ (batch.price * batch.currentQuantity).toLocaleString() }} ₽
              </td>

              <td class="px-6 py-4 text-right">
                <span
                  :class="
                    batch.status === 'active'
                      ? 'text-green-600 bg-green-50'
                      : 'text-slate-400 bg-slate-50'
                  "
                  class="px-2 py-0.5 rounded text-[10px] font-black uppercase border border-current"
                >
                  {{ batch.status === "active" ? "В наличии" : "Пустой" }}
                </span>
              </td>
            </tr>
            <tr v-if="filteredBatches.length === 0">
              <td
                colspan="6"
                class="px-6 py-12 text-center text-slate-400 italic"
              >
                Партии не найдены
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { inventoryApi } from "../api/inventory";

const batches = ref([]);
const parts = ref([]);
const selectedPartId = ref(null);
const onlyActive = ref(true);

const loadInitialData = async () => {
  const [bRes, pRes] = await Promise.all([
    inventoryApi.getBatches(),
    inventoryApi.getParts(),
  ]);
  batches.value = bRes.data;
  parts.value = pRes.data;
};

const filteredBatches = computed(() => {
  let list = batches.value;

  if (selectedPartId.value) {
    list = list.filter((b) => b.partId === selectedPartId.value);
  }

  if (onlyActive.value) {
    list = list.filter((b) => b.status === "active");
  }

  return list;
});

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString("ru-RU") : "—";

onMounted(loadInitialData);
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
</style>
