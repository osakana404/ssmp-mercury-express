<template>
  <div class="max-w-2xl">
    <div class="flex items-center gap-3 mb-6">
      <RouterLink
        to="/parts"
        class="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900"
      >
        ← Назад
      </RouterLink>
      <h2 class="text-2xl font-bold text-slate-900">Списать запчасть</h2>
    </div>

    <form
      class="bg-white rounded-xl shadow-lg p-8 space-y-6"
      @submit.prevent="submit"
    >
      <!-- Выбор запчасти -->
      <div>
        <label class="block mb-3 text-sm font-semibold text-slate-700"
          >Запчасть</label
        >
        <div class="relative">
          <select
            v-model="form.partId"
            required
            class="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-4 pr-12 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          >
            <option value="" disabled>Выберите запчасть</option>
            <option v-for="part in parts" :key="part.id" :value="part.id">
              {{ part.name }} (осталось: {{ part.quantity }})
            </option>
          </select>
          <svg
            class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        <p v-if="selectedPart" class="mt-2 text-sm text-slate-600">
          {{ selectedPart.description || "Описание отсутствует" }}
        </p>
      </div>

      <!-- Выбор машины -->
      <div>
        <label class="block mb-3 text-sm font-semibold text-slate-700"
          >Машина</label
        >
        <div class="relative">
          <select
            v-model="form.carId"
            required
            class="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-4 pr-12 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          >
            <option value="" disabled>Выберите машину</option>
            <option v-for="car in cars" :key="car.id" :value="car.id">
              {{ car.model }} ({{ car.number }})
            </option>
          </select>
          <svg
            class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        <p v-if="selectedCar" class="mt-2 text-sm text-slate-600">
          {{ selectedCar.description }} ({{ selectedCar.status }})
        </p>
      </div>

      <!-- Количество -->
      <div>
        <label class="block mb-3 text-sm font-semibold text-slate-700"
          >Количество</label
        >
        <AppInput
          v-model.number="form.quantity"
          type="number"
          min="1"
          :max="maxQuantity"
          class="w-full"
          placeholder="1"
        />
        <p v-if="selectedPart" class="mt-1 text-xs text-slate-500">
          Доступно:
          <span class="font-semibold">{{ selectedPart.quantity }}</span>
        </p>
      </div>

      <!-- Кнопки -->
      <div class="flex gap-3 pt-4">
        <AppButton type="button" variant="secondary" @click="router.back()">
          Отмена
        </AppButton>
        <AppButton
          type="submit"
          variant="danger"
          :disabled="!isFormValid || loading"
          class="flex-1"
        >
          <span v-if="loading" class="flex items-center gap-2">
            <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Списываем...
          </span>
          <span v-else>Списать запчасть</span>
        </AppButton>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import api from "@/api"; // ← ЭТОГО НЕ БЫЛО!
import { createSpisanie } from "@/api/parts";
import AppInput from "@/components/ui/AppInput.vue";
import AppButton from "@/components/ui/AppButton.vue";

const router = useRouter();

const parts = ref([]);
const cars = ref([]);
const loading = ref(false);

const form = reactive({
  partId: null,
  carId: null,
  quantity: 1,
});

const selectedPart = computed(() =>
  parts.value.find((p) => p.id === form.partId),
);

const selectedCar = computed(() => cars.value.find((c) => c.id === form.carId));

const maxQuantity = computed(() => selectedPart.value?.quantity || 999);

const isFormValid = computed(
  () =>
    form.partId &&
    form.carId &&
    form.quantity > 0 &&
    form.quantity <= maxQuantity.value,
);

const loadData = async () => {
  try {
    const [partsRes, carsRes] = await Promise.all([
      api.get("/parts"),
      api.get("/cars"),
    ]);
    parts.value = partsRes.data;
    cars.value = carsRes.data;
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
  }
};

const submit = async () => {
  if (!isFormValid.value) return;

  loading.value = true;
  try {
    await createSpisanie(form);
    router.push("/transactions");
  } catch (error) {
    console.error("Ошибка списания:", error);
  } finally {
    loading.value = false;
  }
};

watch(
  () => form.quantity,
  (newVal) => {
    if (newVal > maxQuantity.value) {
      form.quantity = maxQuantity.value;
    }
  },
);

onMounted(loadData);
</script>
