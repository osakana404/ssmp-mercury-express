<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold">Новости</h2>
      <RouterLink
        to="/news/create"
        class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Создать новость
      </RouterLink>
    </div>

    <div class="bg-white rounded-xl shadow overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-slate-50 border-b">
          <tr>
            <th class="px-4 py-3">ID</th>
            <th class="px-4 py-3">Название</th>
            <th class="px-4 py-3">Категория</th>
            <th class="px-4 py-3">Файлы</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in news"
            :key="item.id"
            class="border-b hover:bg-slate-50"
          >
            <td class="px-4 py-3">{{ item.id }}</td>
            <td class="px-4 py-3">{{ item.title }}</td>
            <td class="px-4 py-3">{{ item.Category?.name || "-" }}</td>
            <td class="px-4 py-3">{{ item.Files?.length || 0 }}</td>
            <td class="px-4 py-3 text-right">
              <RouterLink
                class="text-blue-600 hover:underline"
                :to="`/news/${item.id}`"
              >
                Открыть
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getNews } from "@/api/news";

const news = ref([]);

onMounted(async () => {
  const { data } = await getNews();
  news.value = data;
});
</script>
