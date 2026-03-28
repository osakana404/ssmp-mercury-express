<script setup>
import { ref, onMounted } from "vue";

const newsList = ref([]);

onMounted(async () => {
  try {
    const response = await fetch("http://localhost:3000/api/v1/news");
    newsList.value = await response.json();
  } catch (e) {
    console.error("Ошибка загрузки:", e);
  }
});
</script>

<template>
  <header>
    <h1>Инструкции и гайды</h1>
  </header>

  <div v-if="newsList.length === 0" class="loading">
    Загрузка базы данных...
  </div>

  <div v-for="item in newsList" :key="item.id" class="news-card">
    <div class="card-header">
      <span class="category-badge" v-if="item.Category">{{
        item.Category.name
      }}</span>
    </div>
    <router-link
      :to="'/news/' + item.id"
      style="text-decoration: none; color: inherit"
    >
      <h2>{{ item.title }}</h2>
      <p>{{ item.content ? item.content.slice(0, 150) : "Нет описания" }}...</p>
      <span style="color: var(--primary-color)">Читать гайд →</span>
    </router-link>
  </div>
</template>
