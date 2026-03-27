<script setup>
import { ref, onMounted } from "vue";

// Создаем реактивную переменную для списка новостей
const newsList = ref([]);

// Функция получения данных
const fetchNews = async () => {
  try {
    const response = await fetch("http://localhost:3000/news");
    if (!response.ok) throw new Error("Ошибка сети");
    newsList.value = await response.json();
  } catch (error) {
    console.error("Не удалось загрузить новости:", error);
  }
};

// Запускаем при загрузке компонента
onMounted(fetchNews);
</script>

<template>
  <div class="container">
    <h1>Вики-Гайды</h1>

    <div v-if="newsList.length === 0">Загрузка или новостей пока нет...</div>

    <div v-for="item in newsList" :key="item.id" class="news-card">
      <h2>{{ item.title }}</h2>
      <p class="category" v-if="item.Category">
        Категория: <strong>{{ item.Category.name }}</strong>
      </p>

      <p>{{ item.content }}</p>

      <div class="assets-gallery">
        <div v-for="file in item.Files" :key="file.id" class="asset">
          <img v-if="file.type === 'image'" :src="file.url" alt="image" />
          <video
            v-else-if="file.type === 'video'"
            :src="file.url"
            controls
          ></video>
        </div>
      </div>
      <hr />
    </div>
  </div>
</template>
