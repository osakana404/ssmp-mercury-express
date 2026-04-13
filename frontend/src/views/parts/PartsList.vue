<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold">Запчасти</h2>
      <div class="flex gap-2">
        <RouterLink to="/parts/prihod">
          <AppButton>Приход</AppButton>
        </RouterLink>
        <RouterLink to="/parts/spisanie">
          <AppButton variant="secondary">Списание</AppButton>
        </RouterLink>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-slate-50 border-b">
          <tr>
            <th class="px-4 py-3">ID</th>
            <th class="px-4 py-3">Название</th>
            <th class="px-4 py-3">Кол-во</th>
            <th class="px-4 py-3">Цена</th>
            <th class="px-4 py-3">Описание</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="part in sortedParts"
            :key="part.id"
            class="border-b hover:bg-slate-50"
          >
            <td class="px-4 py-3">{{ part.id }}</td>
            <td class="px-4 py-3">{{ part.name }}</td>
            <td class="px-4 py-3">{{ part.quantity }}</td>
            <td class="px-4 py-3">{{ part.price }}</td>
            <td class="px-4 py-3">{{ part.description || "-" }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getParts } from "@/api/parts";
import AppButton from "@/components/ui/AppButton.vue";

const parts = ref([]);

const sortedParts = computed(() => {
  return [...parts.value].sort((a, b) => b.id - a.id);
});

onMounted(async () => {
  const { data } = await getParts();
  parts.value = data;
});
</script>
