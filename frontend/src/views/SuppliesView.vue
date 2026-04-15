<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">Приход товара</h1>
        <p class="text-slate-500 text-sm">
          История накладных и детализация составов
        </p>
      </div>
      <AppButton variant="success" @click="openModal">
        📦 Оформить приход
      </AppButton>
    </div>

    <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
      <div class="relative max-w-md">
        <span
          class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400"
        >
          🔍
        </span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Поиск по номеру накладной..."
          class="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg bg-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
    </div>

    <div
      class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
    >
      <table class="w-full text-left border-collapse">
        <thead class="bg-slate-50 border-b">
          <tr
            class="text-[10px] font-bold text-slate-500 uppercase tracking-wider"
          >
            <th class="px-6 py-4 w-10"></th>
            <th class="px-6 py-4">Дата документа</th>
            <th class="px-6 py-4">№ Накладной</th>
            <th class="px-6 py-4">Поставщик</th>
            <th class="px-6 py-4 text-right">Сумма итог</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <template v-for="s in filteredSupplies" :key="s.id">
            <tr
              @click="toggleRow(s.id)"
              class="hover:bg-blue-50/30 transition cursor-pointer"
              :class="{ 'bg-blue-50/50': expandedRows.includes(s.id) }"
            >
              <td class="px-6 py-4 text-center">
                <span
                  class="inline-block transition-transform duration-200"
                  :class="{ 'rotate-90': expandedRows.includes(s.id) }"
                >
                  ▶
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="text-slate-700 font-bold">
                  {{ formatFullDate(s.date) }}
                </div>
                <div class="text-[10px] text-slate-400">ID: {{ s.id }}</div>
              </td>
              <td class="px-6 py-4 font-mono text-blue-600 font-bold">
                {{ s.docNumber || "Б/Н" }}
              </td>
              <td class="px-6 py-4 font-medium">
                {{ s.supplier?.name || "—" }}
              </td>
              <td class="px-6 py-4 text-right font-black text-slate-700">
                {{ s.totalSum?.toLocaleString() }} ₽
              </td>
            </tr>

            <tr v-if="expandedRows.includes(s.id)">
              <td colspan="5" class="bg-slate-50/50 px-12 py-4">
                <div
                  class="bg-white rounded-lg border border-slate-200 shadow-inner overflow-hidden"
                >
                  <table class="w-full text-xs">
                    <thead
                      class="bg-slate-100 border-b text-slate-500 font-bold"
                    >
                      <tr>
                        <th class="px-4 py-2">Запчасть</th>
                        <th class="px-4 py-2 text-center">Кол-во</th>
                        <th class="px-4 py-2 text-right">Цена зак.</th>
                        <th class="px-4 py-2 text-right">Сумма</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="batch in s.batches"
                        :key="batch.id"
                        class="border-b last:border-0 border-slate-100"
                      >
                        <td
                          class="px-4 py-3 font-semibold text-slate-700 italic"
                        >
                          {{ batch.part?.name || "Удаленная деталь" }}
                        </td>
                        <td class="px-4 py-3 text-center">
                          {{ batch.initialQuantity }} шт.
                        </td>
                        <td class="px-4 py-3 text-right text-slate-500">
                          {{ batch.price.toLocaleString() }} ₽
                        </td>
                        <td class="px-4 py-3 text-right font-bold">
                          {{
                            (
                              batch.initialQuantity * batch.price
                            ).toLocaleString()
                          }}
                          ₽
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div
                    class="p-3 bg-slate-50 text-[10px] text-slate-400 flex justify-between"
                  >
                    <span
                      >Запись в базе:
                      {{ new Date(s.createdAt).toLocaleString() }}</span
                    >
                    <span>Позиций: {{ s.batches?.length || 0 }}</span>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Модалка -->
    <AppModal v-model="alertModal.show" :title="alertModal.title" size="sm">
      <div class="text-center py-4">
        <div
          class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          :class="
            alertModal.isError
              ? 'bg-red-100 text-red-600'
              : 'bg-green-100 text-green-600'
          "
        >
          <span class="text-3xl">{{ alertModal.isError ? "✕" : "✓" }}</span>
        </div>
        <p class="text-slate-600 font-medium">{{ alertModal.message }}</p>
      </div>
      <template #footer>
        <AppButton
          :variant="alertModal.isError ? 'danger' : 'success'"
          @click="alertModal.show = false"
          class="w-full"
        >
          Понятно
        </AppButton>
      </template>
    </AppModal>
    <!-- модалка -->

    <AppModal v-model="showModal" title="Новая накладная" size="lg">
      <div class="space-y-6">
        <div
          class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100"
        >
          <div>
            <label
              class="block text-[10px] font-bold text-slate-500 uppercase mb-1"
              >Дата и время документа</label
            >
            <input
              type="datetime-local"
              v-model="form.date"
              class="w-full rounded-lg border-slate-300 border p-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
          <div class="col-span-1">
            <AppInput
              v-model="form.docNumber"
              label="Номер накладной"
              placeholder="ТОРГ-12 №..."
            />
          </div>
          <div>
            <label
              class="block text-[10px] font-bold text-slate-500 uppercase mb-1"
              >Поставщик</label
            >
            <select
              v-model="form.supplierId"
              class="w-full rounded-lg border-slate-300 border p-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
            >
              <option :value="null" disabled>Выберите поставщика</option>
              <option v-for="sup in suppliers" :key="sup.id" :value="sup.id">
                {{ sup.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="border-t pt-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-bold text-slate-800">Состав накладной</h3>
            <button
              @click="addItem"
              class="text-blue-600 text-xs font-bold hover:underline"
            >
              + Добавить деталь
            </button>
          </div>

          <div
            v-for="(item, idx) in form.items"
            :key="idx"
            class="flex items-end gap-3 p-3 bg-white rounded-lg mb-2 border border-slate-200 shadow-sm relative group"
          >
            <div class="flex-1">
              <label
                class="block text-[10px] uppercase font-bold text-slate-400 mb-1"
                >Запчасть</label
              >
              <select
                v-model="item.partId"
                class="w-full rounded border-slate-200 border p-2 text-sm outline-none focus:border-blue-500"
              >
                <option v-for="p in parts" :key="p.id" :value="p.id">
                  {{ p.name }}
                </option>
              </select>
            </div>
            <div class="w-24">
              <AppInput
                v-model.number="item.quantity"
                type="number"
                label="Кол-во"
              />
            </div>
            <div class="w-32">
              <AppInput
                v-model.number="item.price"
                type="number"
                label="Цена за ед."
              />
            </div>
            <button
              @click="removeItem(idx)"
              class="mb-2 text-slate-300 hover:text-red-500 transition"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-between items-center w-full">
          <div class="text-xl font-black text-slate-800">
            Итого: {{ calculateTotal.toLocaleString() }} ₽
          </div>
          <div class="flex gap-2">
            <AppButton variant="secondary" @click="showModal = false"
              >Отмена</AppButton
            >
            <AppButton
              variant="success"
              @click="submitSupply"
              :disabled="!isFormValid"
              >Провести накладную</AppButton
            >
          </div>
        </div>
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

// Состояние
const supplies = ref([]);
const suppliers = ref([]);
const parts = ref([]);
const showModal = ref(false);
const expandedRows = ref([]);
const searchQuery = ref("");
// 2. Добавь новое состояние
const alertModal = ref({
  show: false,
  title: "",
  message: "",
  isError: false,
});
// Функция-помощник для вызова уведомления
const showAlert = (title, message, isError = false) => {
  alertModal.value = { show: true, title, message, isError };
};
// Фильтрация для поиска
const filteredSupplies = computed(() => {
  if (!searchQuery.value) return supplies.value;
  const q = searchQuery.value.toLowerCase();
  return supplies.value.filter((s) => s.docNumber?.toLowerCase().includes(q));
});

// Раскрытие строк
const toggleRow = (id) => {
  const index = expandedRows.value.indexOf(id);
  if (index > -1) expandedRows.value.splice(index, 1);
  else expandedRows.value.push(id);
};

// Формат для datetime-local
const getNowForInput = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};

const form = ref({
  supplierId: null,
  docNumber: "",
  date: getNowForInput(),
  items: [{ partId: null, quantity: 1, price: 0 }],
});

const formatFullDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const calculateTotal = computed(() => {
  return form.value.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  );
});

const isFormValid = computed(() => {
  return (
    form.value.supplierId &&
    form.value.items.length > 0 &&
    form.value.items.every((i) => i.partId && i.quantity > 0)
  );
});

const loadData = async () => {
  try {
    const [sRes, supRes, pRes] = await Promise.all([
      inventoryApi.getSupplies(),
      inventoryApi.getSuppliers(),
      inventoryApi.getParts(),
    ]);
    supplies.value = sRes.data;
    suppliers.value = supRes.data;
    parts.value = pRes.data;
  } catch (e) {
    console.error("Загрузка провалена", e);
  }
};

const openModal = () => {
  form.value = {
    supplierId: null,
    docNumber: "",
    date: getNowForInput(),
    items: [{ partId: null, quantity: 1, price: 0 }],
  };
  showModal.value = true;
};

const addItem = () =>
  form.value.items.push({ partId: null, quantity: 1, price: 0 });
const removeItem = (idx) => form.value.items.splice(idx, 1);

// 3. Обновленный метод отправки
const submitSupply = async () => {
  try {
    await inventoryApi.createSupply(form.value);
    showModal.value = false; // Закрываем форму ввода
    await loadData();

    // Вместо alert() вызываем нашу модалку
    showAlert(
      "Успех",
      "Накладная успешно проведена и добавлена в базу данных.",
      false,
    );
  } catch (e) {
    const errorMsg =
      e.response?.data?.message ||
      "Не удалось сохранить накладную. Проверьте соединение с сервером.";
    showAlert("Ошибка", errorMsg, true);
  }
};

onMounted(loadData);
</script>

<style scoped>
.rotate-90 {
  transform: rotate(90deg);
}
</style>
