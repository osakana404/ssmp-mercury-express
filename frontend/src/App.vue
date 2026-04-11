<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-900">
    <div class="max-w-7xl mx-auto">
      <header
        class="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 class="text-3xl font-extrabold text-blue-600 tracking-tight">
            SSMP Mercury
          </h1>
          <p class="text-gray-500 mt-1">Панель управления складом</p>
        </div>

        <div class="flex bg-gray-100 p-1 rounded-lg">
          <button
            @click="currentTab = 'inventory'"
            :class="
              currentTab === 'inventory'
                ? 'bg-white shadow text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            "
            class="px-4 py-2 rounded-md font-bold transition flex items-center gap-2"
          >
            📦 Склад
          </button>
          <button
            @click="currentTab = 'history'"
            :class="
              currentTab === 'history'
                ? 'bg-white shadow text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            "
            class="px-4 py-2 rounded-md font-bold transition flex items-center gap-2"
          >
            📜 История
          </button>
        </div>
      </header>

      <div
        v-if="currentTab === 'inventory'"
        class="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn"
      >
        <div class="lg:col-span-4 space-y-6">
          <div
            class="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500"
          >
            <h2 class="text-xl font-bold mb-6">📝 Новая операция</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-600 mb-1"
                  >Тип</label
                >
                <select
                  v-model="mode"
                  class="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="prihod">Приход (на склад)</option>
                  <option value="spisanie">Списание (на авто)</option>
                </select>
              </div>

              <div v-if="mode === 'prihod'" class="space-y-4">
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="Название запчасти"
                  class="w-full p-3 border border-gray-200 rounded-lg outline-none"
                />
                <textarea
                  v-model="form.description"
                  placeholder="Описание"
                  class="w-full p-3 border border-gray-200 rounded-lg outline-none"
                  rows="2"
                ></textarea>
                <input
                  v-model.number="form.price"
                  type="number"
                  placeholder="Цена за единицу"
                  class="w-full p-3 border border-gray-200 rounded-lg outline-none"
                />
              </div>

              <div v-if="mode === 'spisanie'" class="space-y-4">
                <input
                  v-model.number="form.partId"
                  type="number"
                  placeholder="ID запчасти"
                  class="w-full p-3 border border-gray-200 rounded-lg outline-none"
                />
                <input
                  v-model.number="form.carId"
                  type="number"
                  placeholder="ID автомобиля"
                  class="w-full p-3 border border-gray-200 rounded-lg outline-none"
                />
              </div>

              <input
                v-model.number="form.quantity"
                type="number"
                placeholder="Количество"
                class="w-full p-3 border border-gray-200 rounded-lg outline-none"
              />

              <button
                @click="submitForm"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg transition transform active:scale-95"
              >
                Выполнить
              </button>
            </div>
          </div>
        </div>

        <div class="lg:col-span-8">
          <div
            class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
          >
            <div
              class="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50"
            >
              <h2 class="text-xl font-bold text-gray-800">Складские запасы</h2>
              <button
                @click="fetchData"
                class="text-blue-600 hover:text-blue-800 font-medium"
              >
                🔄 Обновить
              </button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead
                  class="bg-gray-100/50 text-gray-500 text-xs uppercase font-semibold"
                >
                  <tr>
                    <th class="p-4 border-b">ID</th>
                    <th class="p-4 border-b">Наименование</th>
                    <th class="p-4 border-b">Описание</th>
                    <th class="p-4 border-b">В наличии</th>
                    <th class="p-4 border-b">Цена</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr
                    v-for="item in parts"
                    :key="item.id"
                    class="hover:bg-blue-50/50 transition"
                  >
                    <td class="p-4 text-gray-400 font-mono text-sm">
                      #{{ item.id }}
                    </td>
                    <td class="p-4 font-bold text-gray-800">{{ item.name }}</td>
                    <td
                      class="p-4 text-gray-500 text-sm max-w-xs truncate"
                      :title="item.description"
                    >
                      {{ item.description || "—" }}
                    </td>
                    <td class="p-4">
                      <span
                        :class="
                          item.quantity > 5 ? 'text-green-600' : 'text-red-500'
                        "
                        class="font-bold px-2 py-1 bg-gray-100 rounded"
                        >{{ item.quantity }} шт.</span
                      >
                    </td>
                    <td class="p-4 text-gray-600 font-medium">
                      {{ item.price }} ₽
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div v-if="currentTab === 'history'" class="animate-fadeIn">
        <div
          class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
        >
          <div
            class="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50"
          >
            <h2 class="text-xl font-bold text-gray-800">Журнал транзакций</h2>
            <button
              @click="fetchTransactions"
              class="text-blue-600 hover:text-blue-800 font-medium"
            >
              🔄 Обновить
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead
                class="bg-gray-100/50 text-gray-500 text-xs uppercase font-semibold"
              >
                <tr>
                  <th class="p-4 border-b">Дата</th>
                  <th class="p-4 border-b">Тип</th>
                  <th class="p-4 border-b">Запчасть</th>
                  <th class="p-4 border-b">Авто</th>
                  <th class="p-4 border-b">Кол-во</th>
                  <th class="p-4 border-b">Сумма</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr
                  v-for="t in transactions"
                  :key="t.id"
                  class="hover:bg-gray-50 transition"
                >
                  <td class="p-4 text-xs text-gray-500">
                    {{ new Date(t.createdAt).toLocaleString() }}
                  </td>
                  <td class="p-4">
                    <span
                      :class="
                        t.type?.toLowerCase() === 'приход'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      "
                      class="px-2 py-1 rounded text-xs font-bold uppercase"
                    >
                      {{
                        t.type?.toLowerCase() === "приход"
                          ? "📥 Приход"
                          : "📤 Списание"
                      }}
                    </span>
                  </td>

                  <td class="p-4 font-medium text-gray-700">
                    {{ t.Part?.name || "Удалено (ID: " + t.partId + ")" }}
                  </td>

                  <td class="p-4 text-gray-600 font-semibold">
                    {{ t.Car ? t.Car.number + " (" + t.Car.model + ")" : "—" }}
                  </td>

                  <td class="p-4 font-bold">{{ t.quantity }} шт.</td>
                  <td class="p-4 text-gray-600 font-mono">
                    {{ t.price ? t.price * t.quantity + " ₽" : "—" }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import api from "./api";

const currentTab = ref("inventory");
const parts = ref([]);
const transactions = ref([]);
const mode = ref("prihod");
const form = ref({
  name: "",
  description: "",
  quantity: 1,
  price: 0,
  partId: null,
  carId: null,
});

const fetchData = async () => {
  try {
    const res = await api.get("/parts");
    parts.value = res.data;
  } catch (err) {
    console.error(err);
  }
};

const fetchTransactions = async () => {
  try {
    const res = await api.get("/transactions");
    transactions.value = res.data;
  } catch (err) {
    console.error(err);
  }
};

const submitForm = async () => {
  try {
    const url = mode.value === "prihod" ? "/parts/prihod" : "/parts/spisanie";
    const payload =
      mode.value === "prihod"
        ? {
            name: form.value.name,
            description: form.value.description,
            quantity: form.value.quantity,
            price: form.value.price,
          }
        : {
            partId: form.value.partId,
            carId: form.value.carId,
            quantity: form.value.quantity,
          };

    await api.post(url, payload);
    alert("Операция успешно выполнена!");
    fetchData();
    fetchTransactions();
    form.value = {
      name: "",
      description: "",
      quantity: 1,
      price: 0,
      partId: null,
      carId: null,
    };
  } catch (err) {
    alert(err.response?.data?.message || "Ошибка сервера");
  }
};

// Следим за сменой вкладки, чтобы подгружать данные
watch(currentTab, (newTab) => {
  if (newTab === "inventory") fetchData();
  if (newTab === "history") fetchTransactions();
});

onMounted(() => {
  fetchData();
  fetchTransactions();
});
</script>

<style>
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
