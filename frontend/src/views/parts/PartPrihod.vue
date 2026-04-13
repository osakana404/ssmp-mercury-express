<template>
  <div class="max-w-2xl">
    <div class="flex items-center gap-3 mb-6">
      <RouterLink
        to="/parts"
        class="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900"
      >
        ← Назад
      </RouterLink>
      <h2 class="text-2xl font-bold text-slate-900">Оприходовать запчасть</h2>
    </div>

    <form
      class="bg-white rounded-xl shadow-lg p-8 space-y-6"
      @submit.prevent="submit"
    >
      <!-- Поиск/выбор запчасти -->
      <div>
        <label class="block mb-3 text-sm font-semibold text-slate-700"
          >Запчасть</label
        >
        <div class="relative">
          <input
            v-model="searchQuery"
            @input="debouncedSearch"
            placeholder="Начните вводить название запчасти..."
            class="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 pl-12 pr-12 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          />
          <svg
            class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>

        <!-- Результаты поиска -->
        <div
          v-if="searchResults.length"
          class="mt-2 space-y-2 max-h-48 overflow-y-auto border border-slate-200 rounded-xl bg-slate-50 p-2"
        >
          <button
            v-for="part in searchResults"
            :key="part.id"
            type="button"
            @click="
              selectExistingPart(part);
              searchQuery = '';
            "
            class="w-full text-left rounded-lg p-3 hover:bg-white hover:shadow-sm transition-all"
          >
            <div class="font-semibold text-slate-900">{{ part.name }}</div>
            <div class="text-sm text-slate-600">
              Остаток: {{ part.quantity }} | {{ part.price }} ₽
            </div>
          </button>
        </div>

        <!-- Выбранная существующая запчасть -->
        <div
          v-if="existingPart"
          class="mt-3 p-4 bg-green-50 border border-green-200 rounded-xl"
        >
          <div class="flex items-center justify-between">
            <div>
              <div class="font-semibold text-green-900">
                {{ existingPart.name }}
              </div>
              <div class="text-sm text-green-700">
                Текущий остаток: {{ existingPart.quantity }}
              </div>
            </div>
            <button
              type="button"
              @click="clearExistingPart"
              class="text-green-600 hover:text-green-800 text-sm"
            >
              Изменить
            </button>
          </div>
        </div>

        <!-- Новая запчасть -->
        <div v-if="!existingPart">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <AppInput
              v-model="newPart.name"
              label="Название новой запчасти *"
            />
            <AppInput
              v-model.number="newPart.price"
              label="Цена (₽) *"
              type="number"
            />
          </div>
          <AppInput v-model="newPart.description" label="Описание" />
        </div>
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
        />
        <p class="mt-1 text-xs text-slate-500">
          Максимум: <span class="font-semibold">{{ maxQuantity }}</span>
        </p>
      </div>

      <!-- Дата (опционально) -->
      <div>
        <label class="block mb-3 text-sm font-semibold text-slate-700"
          >Дата прихода</label
        >
        <AppInput v-model="form.date" type="datetime-local" />
      </div>

      <!-- Кнопки -->
      <div class="flex gap-3 pt-4">
        <AppButton type="button" variant="secondary" @click="router.back()">
          Отмена
        </AppButton>
        <AppButton
          type="submit"
          variant="success"
          :disabled="!isFormValid || loading"
          class="flex-1"
        >
          <span v-if="loading" class="flex items-center gap-2">
            <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              ircle class="opacity-25" cx="12" cy="12" r="10"
              stroke="currentColor" stroke-width="4" />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Сохраняем...
          </span>
          <span v-else>
            {{ existingPart ? "Пополнить остаток" : "Создать и оприходовать" }}
          </span>
        </AppButton>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import api from "@/api";
import { createPrihod } from "@/api/parts";
import AppInput from "@/components/ui/AppInput.vue";
import AppButton from "@/components/ui/AppButton.vue";

const router = useRouter();

const parts = ref([]);
const searchQuery = ref("");
const searchResults = ref([]);
const existingPart = ref(null);
const newPart = reactive({
  name: "",
  price: null,
  description: "",
});
const form = reactive({
  quantity: 1,
  date: new Date().toISOString().slice(0, 16),
});
const loading = ref(false);
const searchTimeout = ref(null);

const maxQuantity = computed(() => (existingPart.value ? 999 : null));

const isFormValid = computed(() => {
  if (existingPart.value) {
    return form.quantity > 0;
  }
  return newPart.name && newPart.price && form.quantity > 0;
});

const debouncedSearch = () => {
  clearTimeout(searchTimeout.value);
  searchTimeout.value = setTimeout(async () => {
    if (searchQuery.value.length < 2) {
      searchResults.value = [];
      return;
    }
    try {
      const { data } = await api.get("/parts");
      searchResults.value = data
        .filter((part) =>
          part.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
        )
        .slice(0, 5);
    } catch (error) {
      console.error("Ошибка поиска:", error);
    }
  }, 300);
};

const selectExistingPart = (part) => {
  existingPart.value = part;
  newPart.name = "";
  newPart.price = part.price;
  newPart.description = "";
  form.partId = part.id;
};

const clearExistingPart = () => {
  existingPart.value = null;
  newPart.name = "";
  newPart.price = null;
  newPart.description = "";
  form.partId = null;
};

const submit = async () => {
  if (!isFormValid.value) return;

  loading.value = true;
  try {
    const payload = {
      quantity: form.quantity,
      price: existingPart.value ? existingPart.value.price : newPart.price,
      date: form.date,
      // ✅ Всегда отправляем name!
      name: existingPart.value ? existingPart.value.name : newPart.name,
      ...(existingPart.value ? {} : { description: newPart.description }),
    };

    console.log("Отправляем на backend:", payload); // ← Отладка

    await createPrihod(payload);
    router.push("/parts");
  } catch (error) {
    console.error("Ошибка прихода:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  try {
    const { data } = await api.get("/parts");
    parts.value = data;
  } catch (error) {
    console.error("Ошибка загрузки запчастей:", error);
  }
});
</script>
