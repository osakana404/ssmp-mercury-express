<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">Библиотека запчастей</h1>
        <p class="text-slate-500 text-sm">
          Регистрация новых позиций в каталоге
        </p>
      </div>
      <AppButton variant="primary" @click="openCreateModal">
        ➕ Регистрация запчасти
      </AppButton>
    </div>

    <div
      class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
    >
      <table class="w-full text-left border-collapse">
        <thead class="bg-slate-50 border-b border-slate-200">
          <tr>
            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
              Наименование
            </th>
            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
              Категория
            </th>
            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
              Описание
            </th>
            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
              Тек. Остаток
            </th>
            <th
              class="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right"
            >
              Действия
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr
            v-for="part in parts"
            :key="part.id"
            class="hover:bg-slate-50 transition"
          >
            <td class="px-6 py-4 font-bold text-slate-700">{{ part.name }}</td>
            <td class="px-6 py-4">
              <span
                class="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs"
              >
                {{ part.category?.name || "Без категории" }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-slate-500">
              {{ part.description || "—" }}
            </td>
            <td class="px-6 py-4 font-mono font-bold">
              {{ part.quantity }} шт.
            </td>
            <td class="px-6 py-4 text-right space-x-2">
              <button
                @click="openEditModal(part)"
                class="text-blue-600 hover:text-blue-800 text-sm"
              >
                Редактировать
              </button>
              <button
                @click="confirmDelete(part)"
                class="text-red-600 hover:text-red-800 text-sm"
              >
                Удалить
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <AppModal
      v-model="showModal"
      :title="isEdit ? 'Редактировать запчасть' : 'Регистрация новой запчасти'"
    >
      <div class="space-y-4">
        <AppInput
          v-model="form.name"
          label="Наименование запчасти"
          placeholder="Напр: Фильтр масляный Toyota"
        />

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1"
            >Категория</label
          >
          <select
            v-model="form.categoryId"
            class="w-full rounded border-slate-300 border p-2 text-sm outline-none focus:border-blue-500"
          >
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1"
            >Описание (необязательно)</label
          >
          <textarea
            v-model="form.description"
            class="w-full rounded border-slate-300 border p-2 text-sm h-24 outline-none focus:border-blue-500"
          ></textarea>
        </div>
      </div>

      <template #footer>
        <AppButton variant="secondary" @click="showModal = false"
          >Отмена</AppButton
        >
        <AppButton @click="savePart">{{
          isEdit ? "Обновить" : "Создать"
        }}</AppButton>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { inventoryApi } from "../api/inventory";
import AppButton from "../components/AppButton.vue";
import AppInput from "../components/AppInput.vue";
import AppModal from "../components/AppModal.vue";

const parts = ref([]);
const categories = ref([]);
const showModal = ref(false);
const isEdit = ref(false);
const currentId = ref(null);

const form = ref({
  name: "",
  description: "",
  categoryId: null,
});

const loadData = async () => {
  const [pRes, cRes] = await Promise.all([
    inventoryApi.getParts(),
    inventoryApi.getCategories(),
  ]);
  parts.value = pRes.data;
  categories.value = cRes.data;
};

const openCreateModal = () => {
  isEdit.value = false;
  form.value = {
    name: "",
    description: "",
    categoryId: categories.value[0]?.id,
  };
  showModal.value = true;
};

const openEditModal = (part) => {
  isEdit.value = true;
  currentId.value = part.id;
  form.value = {
    name: part.name,
    description: part.description,
    categoryId: part.categoryId,
  };
  showModal.value = true;
};

const savePart = async () => {
  try {
    if (isEdit.value) {
      await inventoryApi.updatePart(currentId.value, form.value);
    } else {
      await inventoryApi.createPart(form.value);
    }
    showModal.value = false;
    loadData();
  } catch (e) {
    alert(e.response?.data?.message || "Ошибка при сохранении");
  }
};

const confirmDelete = async (part) => {
  if (part.quantity > 0) {
    alert("Нельзя удалить запчасть, которая есть на складе!");
    return;
  }
  if (confirm(`Удалить карточку "${part.name}"?`)) {
    await inventoryApi.deletePart(part.id);
    loadData();
  }
};

onMounted(loadData);
</script>
