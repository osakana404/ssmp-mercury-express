<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-slate-800">Автопарк</h2>
      <AppButton @click="openEditModal()">Добавить авто</AppButton>
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
            <td class="px-6 py-4 font-mono font-bold text-slate-900">
              {{ car.number }}
            </td>
            <td class="px-6 py-4 text-slate-900 font-medium">
              {{ car.model }}
            </td>
            <td class="px-6 py-4 text-slate-500 text-sm max-w-[200px] truncate">
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
              <div class="flex justify-end gap-2">
                <AppButton
                  variant="secondary"
                  @click="openEditModal(car)"
                  class="!px-3 !py-1 text-sm"
                  >Изменить</AppButton
                >
                <AppButton
                  variant="danger"
                  @click="askDeleteConfirmation(car)"
                  class="!px-3 !py-1 text-sm"
                  >Удалить</AppButton
                >
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <AppModal
      v-model="isEditModalOpen"
      :title="editingId ? 'Правка авто' : 'Новое авто'"
    >
      <form @submit.prevent="saveCar" class="space-y-4">
        <AppInput
          v-model="form.number"
          label="Гос. номер"
          placeholder="Т918НЕ"
          required
        />
        <AppInput
          v-model="form.model"
          label="Модель"
          placeholder="Газель, УАЗ"
          required
        />
        <AppTextarea v-model="form.description" label="Описание" :rows="3" />

        <div>
          <label class="block mb-2 text-sm font-medium text-slate-700"
            >Статус</label
          >
          <select
            v-model="form.status"
            class="w-full rounded border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
          >
            <option value="Активна">Активна</option>
            <option value="В рейсе">В рейсе</option>
            <option value="Ремонт">Ремонт</option>
          </select>
        </div>

        <div class="flex gap-3 pt-4">
          <AppButton
            variant="secondary"
            class="flex-1"
            @click="isEditModalOpen = false"
            >Отмена</AppButton
          >
          <AppButton type="submit" variant="success" class="flex-1"
            >Сохранить</AppButton
          >
        </div>
      </form>
    </AppModal>

    <AppModal v-model="isConfirmModalOpen" title="Удаление">
      <div class="text-center p-2">
        <p class="text-slate-600">
          Удалить <b>{{ selectedCar?.number }}</b
          >?
        </p>
      </div>
      <template #footer>
        <AppButton variant="secondary" @click="isConfirmModalOpen = false"
          >Нет</AppButton
        >
        <AppButton variant="danger" @click="confirmDelete"
          >Да, удалить</AppButton
        >
      </template>
    </AppModal>

    <AppModal v-model="statusModal.show" :title="statusModal.title">
      <div class="text-center space-y-4">
        <div
          :class="statusModal.isError ? 'text-red-500' : 'text-green-500'"
          class="text-4xl"
        >
          {{ statusModal.isError ? "❌" : "✅" }}
        </div>
        <p class="text-slate-700">{{ statusModal.message }}</p>
        <AppButton class="w-full" @click="statusModal.show = false"
          >Ок</AppButton
        >
      </div>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/api";
import AppButton from "@/components/ui/AppButton.vue";
import AppInput from "@/components/ui/AppInput.vue";
import AppTextarea from "@/components/ui/AppTextarea.vue";
import AppModal from "@/components/ui/AppModal.vue";

const cars = ref([]);
const selectedCar = ref(null);
const editingId = ref(null);

const isEditModalOpen = ref(false);
const isConfirmModalOpen = ref(false);

// Единое состояние для статусов (успех/ошибка)
const statusModal = ref({
  show: false,
  title: "",
  message: "",
  isError: false,
});

const form = ref({ number: "", model: "", description: "", status: "Активна" });

const showStatus = (msg, isError = false) => {
  statusModal.value = {
    show: true,
    title: isError ? "Ошибка" : "Успешно",
    message: msg,
    isError: isError,
  };
};

const fetchCars = async () => {
  try {
    const { data } = await api.get("/cars");
    cars.value = data;
  } catch (e) {
    showStatus("Ошибка загрузки данных", true);
  }
};

const openEditModal = (car = null) => {
  if (car) {
    editingId.value = car.id;
    form.value = { ...car };
  } else {
    editingId.value = null;
    form.value = { number: "", model: "", description: "", status: "Активна" };
  }
  isEditModalOpen.value = true;
};

const saveCar = async () => {
  try {
    if (editingId.value) {
      await api.patch(`/cars/${editingId.value}`, form.value);
      showStatus("Данные автомобиля обновлены");
    } else {
      await api.post("/cars", form.value);
      showStatus("Автомобиль успешно добавлен");
    }
    isEditModalOpen.value = false;
    await fetchCars();
  } catch (e) {
    showStatus(e.response?.data?.message || "Ошибка при сохранении", true);
  }
};

const askDeleteConfirmation = (car) => {
  selectedCar.value = car;
  isConfirmModalOpen.value = true;
};

const confirmDelete = async () => {
  try {
    await api.delete(`/cars/${selectedCar.value.id}`);
    isConfirmModalOpen.value = false;
    showStatus("Автомобиль удален");
    await fetchCars();
  } catch (e) {
    showStatus("Не удалось удалить автомобиль", true);
  }
};

const statusClass = (s) => {
  const styles = {
    Активна: "bg-emerald-100 text-emerald-700",
    "В рейсе": "bg-blue-100 text-blue-700",
    Ремонт: "bg-rose-100 text-rose-700",
  };
  return styles[s] || "bg-slate-100 text-slate-600";
};

onMounted(fetchCars);
</script>
