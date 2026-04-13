<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold mb-6">Дашборд</h2>

      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div class="rounded-xl bg-white p-5 shadow">
          <div class="text-sm text-slate-500">Новости</div>
          <div class="mt-2 text-3xl font-bold">{{ stats.news }}</div>
        </div>

        <div class="rounded-xl bg-white p-5 shadow">
          <div class="text-sm text-slate-500">Запчасти</div>
          <div class="mt-2 text-3xl font-bold">{{ stats.parts }}</div>
        </div>

        <div
          class="rounded-xl bg-white p-5 shadow border-l-4 border-indigo-500 flex flex-col justify-between"
        >
          <div>
            <div class="text-sm text-slate-500">Автопарк</div>
            <div class="mt-2 text-3xl font-bold">{{ stats.cars }}</div>
          </div>
          <RouterLink
            to="/cars"
            class="text-xs text-indigo-600 hover:underline mt-2 block"
          >
            Управление →
          </RouterLink>
        </div>

        <div class="rounded-xl bg-white p-5 shadow">
          <div class="text-sm text-slate-500">Приходы</div>
          <div class="mt-2 text-3xl font-bold">{{ stats.prihod }}</div>
        </div>

        <div class="rounded-xl bg-white p-5 shadow">
          <div class="text-sm text-slate-500">Списания</div>
          <div class="mt-2 text-3xl font-bold">{{ stats.spisanie }}</div>
        </div>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-3">
      <div class="lg:col-span-2 rounded-xl bg-white p-5 shadow">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">Последние новости</h3>
          <RouterLink to="/news" class="text-sm text-blue-600 hover:underline">
            Все новости
          </RouterLink>
        </div>

        <div v-if="latestNews.length" class="space-y-4">
          <RouterLink
            v-for="item in latestNews"
            :key="item.id"
            :to="`/news/${item.id}`"
            class="block rounded-lg border border-slate-200 p-4 hover:bg-slate-50 transition"
          >
            <div class="flex items-center justify-between gap-4">
              <div>
                <div class="font-semibold">{{ item.title }}</div>
                <div class="text-sm text-slate-500 line-clamp-2">
                  {{ item.content }}
                </div>
              </div>
              <div class="text-xs text-slate-400 whitespace-nowrap">
                {{ item.Category?.name || "Без категории" }}
              </div>
            </div>
          </RouterLink>
        </div>
        <div v-else class="text-slate-500">Новостей пока нет.</div>
      </div>

      <div class="rounded-xl bg-blue-600 text-white p-5 shadow">
        <h3 class="text-lg font-semibold mb-3">Объявление от администратора</h3>
        <p class="text-white/90 leading-6">
          Добро пожаловать в Mercury Express. Здесь публикуются новости
          компании, а также ведется учет запчастей и движений по складу.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/api";

const stats = ref({
  news: 0,
  parts: 0,
  prihod: 0,
  spisanie: 0,
  cars: 0,
});

// ОБЯЗАТЕЛЬНО: добавь эту переменную, иначе v-for не сработает
const latestNews = ref([]);

onMounted(async () => {
  try {
    const [newsRes, partsRes, transactionsRes, carsRes] = await Promise.all([
      api.get("/news"),
      api.get("/parts"),
      api.get("/transactions"),
      api.get("/cars"),
    ]);

    const transactions = transactionsRes.data || [];
    const allNews = newsRes.data || [];

    stats.value = {
      news: allNews.length,
      parts: partsRes.data?.length || 0,
      prihod: transactions.filter((t) => t.type === "prihod").length,
      spisanie: transactions.filter((t) => t.type === "spisanie").length,
      cars: carsRes.data?.length || 0,
    };

    latestNews.value = allNews.slice(0, 5);
  } catch (error) {
    console.error("Ошибка при получении статистики:", error);
  }
});
</script>
