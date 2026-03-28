<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

const props = defineProps(["id"]);
const route = useRoute();
const news = ref(null);

const loadData = async (newsId) => {
  news.value = null; // Очищаем старые данные перед загрузкой
  try {
    const response = await fetch(`http://localhost:3000/api/v1/news/${newsId}`);
    news.value = await response.json();
  } catch (e) {
    console.error("Ошибка:", e);
  }
};

// Загрузка при первом открытии
onMounted(() => loadData(props.id));

// Следим за изменением ID в URL и перекачиваем данные
watch(
  () => route.params.id,
  (newId) => {
    if (newId) loadData(newId);
  },
);
</script>

<template>
  <div v-if="news" class="full-content">
    <header>
      <span class="category-badge" v-if="news.Category">{{
        news.Category.name
      }}</span>
      <h1>{{ news.title }}</h1>
    </header>

    <div class="text-body" style="white-space: pre-wrap">
      {{ news.content || "Описание отсутствует" }}
    </div>

    <h3 v-if="news.Files && news.Files.length > 0" style="margin-top: 40px">
      Прикрепленные медиафайлы:
    </h3>
    <div class="gallery">
      <div v-for="file in news.Files" :key="file.id" class="asset">
        <img
          v-if="file.type === 'image'"
          :src="file.url"
          @click="window.open(file.url)"
          style="cursor: zoom-in"
        />

        <video v-else-if="file.type === 'video'" controls>
          <source :src="file.url" type="video/mp4" />
          Ваш браузер не поддерживает видео.
        </video>
      </div>
    </div>
  </div>
  <div v-else class="loading">Загрузка данных гайда...</div>
</template>
