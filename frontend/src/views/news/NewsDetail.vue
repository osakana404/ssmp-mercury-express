<template>
  <div v-if="news" class="max-w-5xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <RouterLink to="/news" class="text-blue-600 hover:underline">
        ← Назад к новостям
      </RouterLink>

      <div class="text-sm text-slate-500">
        {{ news.Category?.name || "Без категории" }}
      </div>
    </div>

    <div
      class="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-200"
    >
      <div v-if="images.length" class="relative group">
        <img
          :src="selectedImage"
          :alt="news.title"
          class="h-[460px] w-full cursor-zoom-in object-cover transition duration-500 group-hover:scale-[1.03]"
          @click="openPreview(selectedImage)"
        />

        <div
          class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"
        ></div>

        <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div
            class="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs backdrop-blur"
          >
            Фото новости
          </div>
          <h1 class="mt-3 text-3xl font-bold md:text-4xl">
            {{ news.title }}
          </h1>
        </div>

        <button
          class="absolute right-4 top-4 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-slate-900 shadow-lg transition hover:bg-white"
          @click="openPreview(selectedImage)"
        >
          Увеличить
        </button>
      </div>

      <div class="p-6 md:p-8">
        <div class="prose max-w-none prose-slate">
          <p class="whitespace-pre-line text-slate-700 leading-7">
            {{ news.content }}
          </p>
        </div>

        <div v-if="images.length > 1" class="mt-8">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold">Все изображения</h2>
            <span class="text-sm text-slate-500">{{ images.length }} шт.</span>
          </div>

          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <button
              v-for="img in images"
              :key="img.url"
              class="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              @click="openPreview(img.url)"
            >
              <div class="relative aspect-[4/3] overflow-hidden">
                <img
                  :src="img.url"
                  :alt="news.title"
                  class="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
                <div
                  class="absolute inset-0 bg-black/0 transition group-hover:bg-black/10"
                ></div>
              </div>

              <div class="flex items-center justify-between px-4 py-3">
                <span class="text-sm font-medium text-slate-700">Открыть</span>
                <span class="text-xs text-slate-400">клик</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="previewUrl"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      @click.self="closePreview"
    >
      <div class="relative w-full max-w-6xl">
        <button
          class="absolute -top-14 right-0 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-lg transition hover:bg-slate-100"
          @click="closePreview"
        >
          Закрыть
        </button>

        <img
          :src="previewUrl"
          alt="preview"
          class="max-h-[90vh] w-full rounded-3xl object-contain shadow-2xl"
        />
      </div>
    </div>
  </div>

  <div v-else class="text-slate-500">Загрузка...</div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { getNewsById } from "@/api/news";

const props = defineProps({
  id: [String, Number],
});

const news = ref(null);
const previewUrl = ref("");

const isImage = (url) => /\.(png|jpe?g|gif|webp|svg)$/i.test(url);

const images = computed(() => {
  return (news.value?.Files || []).filter((f) => isImage(f.url));
});

const selectedImage = computed(() => images.value[0]?.url || "");

const openPreview = (url) => {
  previewUrl.value = url;
};

const closePreview = () => {
  previewUrl.value = "";
};

const onKeydown = (e) => {
  if (e.key === "Escape") closePreview();
};

onMounted(async () => {
  const { data } = await getNewsById(props.id);
  news.value = data;
  window.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown);
});
</script>
