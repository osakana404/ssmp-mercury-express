<template>
  <div class="min-h-screen bg-slate-100 p-8">
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-800 tracking-tight">
            Mercury Склад
          </h1>
          <p class="text-slate-500">Учет запчастей и приход товара</p>
        </div>
        <div class="flex gap-3">
          <AppButton variant="success" @click="showSupplyModal = true"
            >📦 Новый приход</AppButton
          >
          <AppButton variant="danger" @click="showDisburseModal = true"
            >🔧 Списать на авто</AppButton
          >
        </div>
      </div>

      <div
        class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
      >
        <table class="w-full text-left border-collapse">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th
                class="px-6 py-4 text-xs font-semibold text-slate-600 uppercase"
              >
                Запчасть
              </th>
              <th
                class="px-6 py-4 text-xs font-semibold text-slate-600 uppercase"
              >
                Категория
              </th>
              <th
                class="px-6 py-4 text-xs font-semibold text-slate-600 uppercase"
              >
                Остаток
              </th>
              <th
                class="px-6 py-4 text-xs font-semibold text-slate-600 uppercase"
              >
                Статус
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="part in parts"
              :key="part.id"
              class="hover:bg-slate-50/80 transition"
            >
              <td class="px-6 py-4 font-medium text-slate-700">
                {{ part.name }}
              </td>

              <td class="px-6 py-4">
                <span
                  class="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded"
                >
                  {{ part.category?.name || "Без категории" }}
                </span>
              </td>

              <td class="px-6 py-4 font-bold text-slate-900">
                {{ part.quantity || 0 }} шт.
              </td>

              <td class="px-6 py-4">
                <span
                  v-if="part.quantity > 0"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  В наличии
                </span>
                <span
                  v-else
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                >
                  Нет на складе
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <AppModal v-model="showSupplyModal" title="Оформление накладной">
        <div class="space-y-4">
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1"
                >Поставщик</label
              >
              <select
                v-model="supplyForm.supplierId"
                class="w-full rounded border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500 border"
              >
                <option v-for="s in suppliers" :key="s.id" :value="s.id">
                  {{ s.name }}
                </option>
              </select>
            </div>
            <AppInput
              v-model="supplyForm.docNumber"
              label="Номер накладной"
              placeholder="Напр: №001"
            />
          </div>

          <div class="border-t pt-4">
            <div class="flex justify-between items-center mb-2">
              <h4 class="text-sm font-bold">Позиции:</h4>
              <button
                @click="addSupplyItem"
                class="text-blue-600 text-xs hover:underline"
              >
                + Добавить строку
              </button>
            </div>
            <div
              v-for="(item, idx) in supplyForm.items"
              :key="idx"
              class="p-3 bg-slate-50 rounded-lg mb-3 border border-slate-200"
            >
              <select
                v-model="item.partId"
                class="w-full mb-2 rounded border-slate-300 text-sm p-2 border"
              >
                <option v-for="p in parts" :key="p.id" :value="p.id">
                  {{ p.name }}
                </option>
              </select>
              <div class="flex gap-2">
                <AppInput
                  v-model="item.quantity"
                  type="number"
                  placeholder="Кол-во"
                  class="flex-1"
                />
                <AppInput
                  v-model="item.price"
                  type="number"
                  placeholder="Цена"
                  class="flex-1"
                />
                <button
                  @click="removeSupplyItem(idx)"
                  class="text-red-500 px-2"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>
        <template #footer>
          <AppButton variant="secondary" @click="showSupplyModal = false"
            >Отмена</AppButton
          >
          <AppButton variant="success" @click="submitSupply"
            >Сохранить приход</AppButton
          >
        </template>
      </AppModal>

      <AppModal v-model="showDisburseModal" title="Списание запчасти">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1"
              >Автомобиль</label
            >
            <select
              v-model="disburseForm.carId"
              class="w-full rounded border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500 border"
            >
              <option v-for="c in cars" :key="c.id" :value="c.id">
                {{ c.number }} — {{ c.model }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1"
              >Запчасть</label
            >
            <select
              v-model="disburseForm.partId"
              class="w-full rounded border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500 border"
            >
              <option v-for="p in parts" :key="p.id" :value="p.id">
                {{ p.name }} (Остаток: {{ p.quantity || 0 }})
              </option>
            </select>
          </div>
          <AppInput
            v-model="disburseForm.quantity"
            type="number"
            label="Количество для списания"
          />
        </div>
        <template #footer>
          <AppButton variant="secondary" @click="showDisburseModal = false"
            >Отмена</AppButton
          >
          <AppButton @click="submitDisburse">Списать по FIFO</AppButton>
        </template>
      </AppModal>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { inventoryApi } from "../api/inventory";
import AppButton from "../components/AppButton.vue";
import AppInput from "../components/AppInput.vue";
import AppModal from "../components/AppModal.vue";

const parts = ref([]);
const suppliers = ref([]);
const cars = ref([]);

const showSupplyModal = ref(false);
const showDisburseModal = ref(false);

const supplyForm = ref({
  supplierId: null,
  docNumber: "",
  items: [{ partId: null, quantity: 1, price: 0 }],
});

const disburseForm = ref({
  partId: null,
  carId: null,
  quantity: 1,
});

const loadData = async () => {
  try {
    const [p, s, c] = await Promise.all([
      inventoryApi.getParts(),
      inventoryApi.getSuppliers(),
      inventoryApi.getCars(),
    ]);

    parts.value = p.data;
    suppliers.value = s.data;
    cars.value = c.data;
  } catch (e) {
    console.error("Ошибка сети:", e);
  }
};

const addSupplyItem = () =>
  supplyForm.value.items.push({ partId: null, quantity: 1, price: 0 });
const removeSupplyItem = (idx) => supplyForm.value.items.splice(idx, 1);

const submitSupply = async () => {
  try {
    await inventoryApi.createSupply(supplyForm.value);
    showSupplyModal.value = false;
    supplyForm.value = {
      supplierId: null,
      docNumber: "",
      items: [{ partId: null, quantity: 1, price: 0 }],
    };
    loadData();
    alert("Приход оформлен успешно!");
  } catch (e) {
    alert(e.response?.data?.message || "Ошибка прихода");
  }
};

const submitDisburse = async () => {
  try {
    await inventoryApi.disbursePart(disburseForm.value);
    showDisburseModal.value = false;
    loadData();
    alert("Списание выполнено!");
  } catch (e) {
    alert(e.response?.data?.message || "Ошибка списания");
  }
};

onMounted(loadData);
</script>
