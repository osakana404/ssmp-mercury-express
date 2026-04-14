<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">Справочники</h1>
        <p class="text-slate-500 text-sm">
          Управление автопарком, запчастями и контрагентами
        </p>
      </div>
      <AppButton variant="primary" @click="openModal">
        ➕ Добавить {{ tabLabels[activeTab].single }}
      </AppButton>
    </div>

    <div class="flex border-b border-slate-200 gap-6 overflow-x-auto">
      <button
        v-for="(label, key) in tabLabels"
        :key="key"
        @click="activeTab = key"
        :class="
          activeTab === key
            ? 'border-blue-600 text-blue-600'
            : 'border-transparent text-slate-500'
        "
        class="pb-3 border-b-2 font-bold transition-all whitespace-nowrap"
      >
        {{ label.plural }}
      </button>
    </div>

    <div
      class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
    >
      <table class="w-full text-left border-collapse">
        <thead
          class="bg-slate-50 border-b text-[10px] font-bold text-slate-500 uppercase tracking-wider"
        >
          <tr v-if="activeTab === 'parts'">
            <th class="px-6 py-4">Запчасть / Описание</th>
            <th class="px-6 py-4">Категория</th>
            <th class="px-6 py-4 text-center">Остаток</th>
            <th class="px-6 py-4 text-right">Действия</th>
          </tr>
          <tr v-else-if="activeTab === 'cars'">
            <th class="px-6 py-4">Гос. Номер / Модель</th>
            <th class="px-6 py-4">Статус</th>
            <th class="px-6 py-4 text-right">Действия</th>
          </tr>
          <tr v-else-if="activeTab === 'suppliers'">
            <th class="px-6 py-4">Компания / ИНН</th>
            <th class="px-6 py-4">Контакты</th>
            <th class="px-6 py-4 text-right">Действия</th>
          </tr>
          <tr v-else>
            <th class="px-6 py-4">Название категории</th>
            <th class="px-6 py-4 text-right">Действия</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-slate-100">
          <tr
            v-for="item in currentList"
            :key="item.id"
            class="hover:bg-slate-50/50 transition text-sm"
          >
            <template v-if="activeTab === 'parts'">
              <td class="px-6 py-4">
                <div class="font-bold text-slate-700">{{ item.name }}</div>
                <div
                  class="text-[10px] text-slate-400 italic truncate max-w-[200px]"
                >
                  {{ item.description }}
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="text-xs bg-slate-100 px-2 py-1 rounded">{{
                  item.category?.name || "Без категории"
                }}</span>
              </td>
              <td
                class="px-6 py-4 text-center font-mono"
                :class="item.quantity > 0 ? 'text-green-600' : 'text-slate-400'"
              >
                {{ item.quantity }} шт.
              </td>
            </template>

            <template v-else-if="activeTab === 'cars'">
              <td class="px-6 py-4">
                <div class="font-black text-slate-700 uppercase">
                  {{ item.number }}
                </div>
                <div class="text-xs text-slate-500">{{ item.model }}</div>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="statusClass(item.status)"
                  class="px-2 py-0.5 rounded text-[10px] font-bold uppercase border"
                >
                  {{ item.status }}
                </span>
              </td>
            </template>

            <template v-else-if="activeTab === 'suppliers'">
              <td class="px-6 py-4">
                <div class="font-bold text-slate-800">{{ item.name }}</div>
                <div class="text-[10px] text-slate-400 font-mono italic">
                  ИНН: {{ item.inn || "—" }}
                </div>
              </td>
              <td class="px-6 py-4 text-xs text-slate-600">
                <div>{{ item.phone || "Нет тел." }}</div>
                <div class="text-blue-500">{{ item.email }}</div>
              </td>
            </template>

            <template v-else>
              <td class="px-6 py-4 font-medium text-slate-700">
                {{ item.name }}
              </td>
            </template>

            <td class="px-6 py-4 text-right space-x-2">
              <button
                @click="editItem(item)"
                class="text-blue-600 hover:bg-blue-50 p-1.5 rounded"
              >
                ✎
              </button>
              <button
                @click="deleteItem(item.id)"
                class="text-red-600 hover:bg-red-50 p-1.5 rounded"
              >
                ✕
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <AppModal
      v-model="showModal"
      :title="isEdit ? 'Редактировать запись' : 'Создать запись'"
    >
      <div class="space-y-4">
        <div v-if="activeTab === 'parts'" class="space-y-4">
          <AppInput
            v-model="form.name"
            label="Название запчасти"
            placeholder="Фильтр, Колодки и т.д."
          />
          <div>
            <label
              class="block text-[10px] font-bold text-slate-500 uppercase mb-1"
              >Категория</label
            >
            <select
              v-model="form.categoryId"
              class="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option :value="null">-- Без категории --</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>
          <div>
            <label
              class="block text-[10px] font-bold text-slate-500 uppercase mb-1"
              >Описание запчасти</label
            >
            <textarea
              v-model="form.description"
              class="w-full border rounded-lg p-2 text-sm h-20 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Артикул, характеристики..."
            ></textarea>
          </div>
          <div
            class="bg-blue-50 p-3 rounded text-[11px] text-blue-700 border-l-4 border-blue-400"
          >
            💡 Остаток меняется только документами Прихода или Списания.
          </div>
        </div>

        <div v-else-if="activeTab === 'cars'" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <AppInput v-model="form.number" label="Гос. номер" />
            <AppInput v-model="form.model" label="Марка / Модель" />
          </div>
          <div>
            <label
              class="block text-[10px] font-bold text-slate-500 uppercase mb-1"
              >Статус</label
            >
            <select
              v-model="form.status"
              class="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="в работе">в работе</option>
              <option value="ремонт">ремонт</option>
              <option value="списана">списана</option>
            </select>
          </div>
          <div>
            <label
              class="block text-[10px] font-bold text-slate-500 uppercase mb-1"
              >Заметки по машине</label
            >
            <textarea
              v-model="form.description"
              class="w-full border rounded-lg p-2 text-sm h-20 outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
        </div>

        <div v-else-if="activeTab === 'suppliers'" class="space-y-4">
          <AppInput v-model="form.name" label="Компания" />
          <div class="grid grid-cols-2 gap-4">
            <AppInput v-model="form.inn" label="ИНН" />
            <AppInput v-model="form.phone" label="Телефон" />
          </div>
          <AppInput v-model="form.email" label="Email" />
          <AppInput v-model="form.address" label="Адрес" />
        </div>

        <div v-else-if="activeTab === 'categories'">
          <AppInput v-model="form.name" label="Название категории" />
        </div>
      </div>

      <template #footer>
        <AppButton variant="secondary" @click="showModal = false"
          >Отмена</AppButton
        >
        <AppButton variant="primary" @click="saveData">Сохранить</AppButton>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { inventoryApi } from "../api/inventory";
import AppButton from "../components/AppButton.vue";
import AppInput from "../components/AppInput.vue";
import AppModal from "../components/AppModal.vue";

const activeTab = ref("parts");
const showModal = ref(false);
const isEdit = ref(false);
const currentId = ref(null);

const tabLabels = {
  parts: { single: "запчасть", plural: "⚙️ Запчасти" },
  cars: { single: "автомобиль", plural: "🚗 Автопарк" },
  suppliers: { single: "поставщика", plural: "🤝 Поставщики" },
  categories: { single: "категорию", plural: "📂 Категории" },
};

const parts = ref([]);
const cars = ref([]);
const suppliers = ref([]);
const categories = ref([]);

const form = ref({
  name: "",
  categoryId: null,
  description: "",
  number: "",
  model: "",
  status: "в работе",
  inn: "",
  phone: "",
  email: "",
  address: "",
});

const currentList = computed(() => {
  if (activeTab.value === "parts") return parts.value;
  if (activeTab.value === "cars") return cars.value;
  if (activeTab.value === "suppliers") return suppliers.value;
  return categories.value;
});

const statusClass = (status) => {
  if (status === "в работе")
    return "bg-green-50 text-green-700 border-green-100";
  if (status === "ремонт") return "bg-amber-50 text-amber-700 border-amber-100";
  return "bg-red-50 text-red-700 border-red-100";
};

const loadData = async () => {
  // 1. Сначала просто обнуляем списки, чтобы не было старых данных
  // 2. Используем Settled, чтобы даже если категорий нет, остальное загрузилось
  const results = await Promise.allSettled([
    inventoryApi.getParts(),
    inventoryApi.getCars(),
    inventoryApi.getSuppliers(),
    inventoryApi.getCategories(),
  ]);

  // Разбираем результаты по одному
  if (results[0].status === "fulfilled") parts.value = results[0].value.data;
  else console.error("Ошибка запчастей:", results[0].reason);

  if (results[1].status === "fulfilled") cars.value = results[1].value.data;
  else console.error("Ошибка машин:", results[1].reason);

  if (results[2].status === "fulfilled")
    suppliers.value = results[2].value.data;
  else console.error("Ошибка поставщиков:", results[2].reason);

  if (results[3].status === "fulfilled")
    categories.value = results[3].value.data;
  else
    console.error("Ошибка категорий (возможно, роута нет):", results[3].reason);
};

const openModal = () => {
  isEdit.value = false;
  currentId.value = null;
  form.value = {
    name: "",
    categoryId: null,
    description: "Без описания",
    number: "",
    model: "",
    status: "в работе",
    inn: "",
    phone: "",
    email: "",
    address: "",
  };
  showModal.value = true;
};

const editItem = (item) => {
  isEdit.value = true;
  currentId.value = item.id;
  form.value = { ...item };
  showModal.value = true;
};

const saveData = async () => {
  try {
    const apiMap = {
      parts: { create: "createPart", update: "updatePart" },
      cars: { create: "createCar", update: "updateCar" },
      suppliers: { create: "createSupplier", update: "updateSupplier" },
      categories: { create: "createCategory", update: "updateCategory" },
    };
    const action = isEdit.value
      ? apiMap[activeTab.value].update
      : apiMap[activeTab.value].create;

    isEdit.value
      ? await inventoryApi[action](currentId.value, form.value)
      : await inventoryApi[action](form.value);

    showModal.value = false;
    loadData();
  } catch (e) {
    alert(e.response?.data?.message || "Ошибка сохранения");
  }
};

const deleteItem = async (id) => {
  if (!confirm("Удалить запись?")) return;
  const delMap = {
    parts: "deletePart",
    cars: "deleteCar",
    suppliers: "deleteSupplier",
    categories: "deleteCategory",
  };
  try {
    await inventoryApi[delMap[activeTab.value]](id);
    loadData();
  } catch (e) {
    alert("Ошибка: запись используется в документах.");
  }
};

onMounted(loadData);
</script>
