<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">
          Списание на автомобиль
        </h1>
        <p class="text-slate-500 text-sm">
          Установка запчастей из наличия на транспорт
        </p>
      </div>
      <AppButton variant="danger" @click="showModal = true">
        🔧 Новое списание
      </AppButton>
    </div>

    <div
      class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
    >
      <div class="p-4 border-b bg-slate-50">
        <h3 class="font-bold text-slate-700 text-sm uppercase">
          Последние операции списания
        </h3>
      </div>
      <table class="w-full text-left border-collapse">
        <thead class="bg-slate-50/50">
          <tr>
            <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
              Дата
            </th>
            <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
              Автомобиль
            </th>
            <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
              Запчасть
            </th>
            <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
              Кол-во
            </th>
            <th
              class="px-6 py-3 text-xs font-bold text-slate-500 uppercase text-right"
            >
              Сумма (FIFO)
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr
            v-for="t in recentDisbursements"
            :key="t.id"
            class="hover:bg-slate-50/50 transition text-sm"
          >
            <td class="px-6 py-4 text-slate-500">
              {{ new Date(t.date).toLocaleDateString() }}
            </td>
            <td class="px-6 py-4">
              <span class="font-bold text-slate-700">{{ t.Car?.number }}</span>
              <div class="text-[10px] text-slate-400">{{ t.Car?.model }}</div>
            </td>
            <td class="px-6 py-4 font-medium">{{ t.Part?.name }}</td>
            <td class="px-6 py-4 text-red-600 font-bold">
              - {{ t.quantity }} шт.
            </td>
            <td class="px-6 py-4 text-right font-bold">
              {{ t.sum.toLocaleString() }} ₽
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <AppModal v-model="showModal" title="Оформить установку детали">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1"
            >Автомобиль (Куда ставим?)</label
          >
          <select
            v-model="form.carId"
            class="w-full rounded border-slate-300 border p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option :value="null">-- Выберите машину --</option>
            <option v-for="c in cars" :key="c.id" :value="c.id">
              {{ c.number }} — {{ c.model }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1"
            >Запчасть (Что списываем?)</label
          >
          <select
            v-model="form.partId"
            class="w-full rounded border-slate-300 border p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option :value="null">-- Выберите деталь из наличия --</option>
            <option v-for="p in availableParts" :key="p.id" :value="p.id">
              {{ p.name }} (Остаток: {{ p.quantity }} шт.)
            </option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <AppInput
            v-model.number="form.quantity"
            type="number"
            label="Количество"
            placeholder="1"
          />
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1"
              >Макс. доступно</label
            >
            <div
              class="p-2 bg-slate-100 rounded text-slate-600 font-bold text-sm"
            >
              {{ selectedPartLimit }} шт.
            </div>
          </div>
        </div>

        <AppInput
          v-model="form.comment"
          label="Примечание (Причина)"
          placeholder="Напр: Плановое ТО, замена по износу"
        />
      </div>

      <template #footer>
        <AppButton variant="secondary" @click="showModal = false"
          >Отмена</AppButton
        >
        <AppButton
          variant="danger"
          @click="submitDisburse"
          :disabled="
            !form.carId ||
            !form.partId ||
            form.quantity <= 0 ||
            form.quantity > selectedPartLimit
          "
        >
          Списать со склада
        </AppButton>
      </template>
    </AppModal>

    <AppModal v-model="alertModal.show" :title="alertModal.title">
      <div class="text-center py-4">
        <div
          class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          :class="
            alertModal.isError
              ? 'bg-red-100 text-red-600'
              : 'bg-emerald-100 text-emerald-600'
          "
        >
          <span class="text-3xl font-bold">
            {{ alertModal.isError ? "✕" : "✓" }}
          </span>
        </div>

        <p class="text-slate-600 font-medium">
          {{ alertModal.message }}
        </p>
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { inventoryApi } from "../api/inventory";
import AppButton from "../components/AppButton.vue";
import AppInput from "../components/AppInput.vue";
import AppModal from "../components/AppModal.vue";

const showModal = ref(false);
const parts = ref([]);
const cars = ref([]);
const transactions = ref([]);

const form = ref({
  carId: null,
  partId: null,
  quantity: 1,
  comment: "",
});

// Создаем реактивный объект для управления уведомлением
const alertModal = ref({
  show: false, // Видна ли модалка
  title: "", // Заголовок (Успех/Ошибка)
  message: "", // Текст сообщения
  isError: false, // Флаг для смены цвета (красный/зеленый)
});
const showAlert = (title, message, isError = false) => {
  alertModal.value = {
    show: true,
    title,
    message,
    isError,
  };
};
// Только те запчасти, которые реально есть на складе
const availableParts = computed(() =>
  parts.value.filter((p) => p.quantity > 0),
);

// Лимит для валидации
const selectedPartLimit = computed(() => {
  const part = parts.value.find((p) => p.id === form.value.partId);
  return part ? part.quantity : 0;
});

// Берем только транзакции типа "списание" для таблицы
const recentDisbursements = computed(() => {
  return transactions.value.filter((t) => t.type === "списание").slice(0, 10);
});

const loadData = async () => {
  try {
    const [pRes, cRes, tRes] = await Promise.all([
      inventoryApi.getParts(),
      inventoryApi.getCars(),
      inventoryApi.getAllTransactions(),
    ]);
    parts.value = pRes.data;
    cars.value = cRes.data;
    transactions.value = tRes.data;
  } catch (e) {
    console.error("Ошибка загрузки данных", e);
  }
};

const submitDisburse = async () => {
  try {
    await inventoryApi.disbursePart(form.value);
    showModal.value = false; // Закрываем основную форму ввода

    await loadData(); // Обновляем данные в таблице

    // ВМЕСТО alert("Успех")
    showAlert("Готово!", "Деталь успешно списана.", false);

    // Очищаем форму для следующего раза
    form.value = { carId: null, partId: null, quantity: 1, comment: "" };
  } catch (e) {
    // ВМЕСТО alert("Ошибка")
    const msg = e.response?.data?.message || "Ошибка при связи с сервером";
    showAlert("Проблема", msg, true);
  }
};

onMounted(loadData);
</script>
