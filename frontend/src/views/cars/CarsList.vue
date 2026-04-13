<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-slate-800">Автопарк</h2>
      <button
        @click="openModal()"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl transition-all shadow-sm flex items-center gap-2"
      >
        <span class="text-xl">+</span> Добавить авто
      </button>
    </div>

    <div
      class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
    >
      <table class="w-full text-left">
        <thead class="bg-slate-50 border-b border-slate-100">
          <tr>
            <th class="px-6 py-4 font-semibold text-slate-600">Гос. номер</th>
            <th class="px-6 py-4 font-semibold text-slate-600">Модель</th>
            <th class="px-6 py-4 font-semibold text-slate-600">Описание</th>
            <th class="px-6 py-4 font-semibold text-slate-600">Статус</th>
            <th class="px-6 py-4 font-semibold text-slate-600 text-right">
              Действия
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr
            v-for="car in cars"
            :key="car.id"
            class="hover:bg-slate-50/50 transition-colors"
          >
            <td class="px-6 py-4">
              <span
                class="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded"
              >
                {{ car.number }}
              </span>
            </td>
            <td class="px-6 py-4 text-slate-900 font-medium">
              {{ car.model }}
            </td>
            <td class="px-6 py-4 text-slate-500 text-sm max-w-xs truncate">
              {{ car.description || "—" }}
            </td>
            <td class="px-6 py-4">
              <span
                :class="statusClass(car.status)"
                class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
              >
                {{ car.status || "Активна" }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex justify-end gap-3">
                <button
                  @click="openModal(car)"
                  class="text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  @click="deleteCar(car)"
                  class="text-slate-400 hover:text-red-600 transition-colors"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div class="px-6 py-4 border-b flex justify-between items-center">
          <h3 class="text-xl font-bold text-slate-800">
            {{ editingId ? "Правка данных" : "Новое авто" }}
          </h3>
          <button
            @click="isModalOpen = false"
            class="text-slate-400 hover:text-slate-600 text-2xl"
          >
            &times;
          </button>
        </div>

        <form @submit.prevent="saveCar" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1"
              >Гос. номер</label
            >
            <input
              v-model="form.number"
              type="text"
              placeholder="A 000 AA"
              required
              class="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1"
              >Модель</label
            >
            <input
              v-model="form.model"
              type="text"
              placeholder="Газель, Камаз..."
              required
              class="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1"
              >Описание</label
            >
            <textarea
              v-model="form.description"
              rows="2"
              class="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1"
              >Статус</label
            >
            <select
              v-model="form.status"
              class="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            >
              <option value="Активна">Активна</option>
              <option value="В рейсе">В рейсе</option>
              <option value="Ремонт">Ремонт</option>
            </select>
          </div>

          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="isModalOpen = false"
              class="flex-1 px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
            >
              {{ editingId ? "Обновить" : "Создать" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/api";

const cars = ref([]);
const isModalOpen = ref(false);
const editingId = ref(null);

const form = ref({
  number: "",
  model: "",
  description: "",
  status: "Активна",
});

const fetchCars = async () => {
  try {
    const { data } = await api.get("/cars");
    cars.value = data;
  } catch (error) {
    console.error("Ошибка загрузки:", error);
  }
};

const openModal = (car = null) => {
  if (car) {
    editingId.value = car.id;
    form.value = { ...car };
  } else {
    editingId.value = null;
    form.value = { number: "", model: "", description: "", status: "Активна" };
  }
  isModalOpen.value = true;
};

const saveCar = async () => {
  try {
    if (editingId.value) {
      // Используем PATCH, как в твоем роутере
      await api.patch(`/cars/${editingId.value}`, form.value);
    } else {
      // POST запрос
      await api.post("/cars", form.value);
    }
    await fetchCars();
    isModalOpen.value = false;
  } catch (error) {
    alert(error.response?.data?.message || "Ошибка сервера");
  }
};

const deleteCar = async (car) => {
  if (!confirm(`Удалить машину ${car.number}?`)) return;
  try {
    await api.delete(`/cars/${car.id}`);
    await fetchCars();
  } catch (error) {
    console.error(error);
  }
};

const statusClass = (status) => {
  const classes = {
    Активна: "bg-emerald-100 text-emerald-700",
    "В рейсе": "bg-blue-100 text-blue-700",
    Ремонт: "bg-rose-100 text-rose-700",
  };
  return classes[status] || "bg-slate-100 text-slate-600";
};

onMounted(fetchCars);
</script>
