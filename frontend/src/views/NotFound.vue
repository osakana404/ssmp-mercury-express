<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-6">
    <div class="max-w-md w-full text-center space-y-8">
      <div class="relative">
        <h1 class="text-9xl font-black text-slate-200 animate-pulse">404</h1>
        <p
          class="absolute inset-0 flex items-center justify-center text-3xl font-bold text-slate-800 mt-8"
        >
          Упс! Тупик.
        </p>
      </div>

      <div class="space-y-2">
        <h2 class="text-xl font-semibold text-slate-700">
          Страница не найдена
        </h2>
        <p class="text-slate-500 text-sm">
          Похоже, эта накладная или деталь потерялась где-то в недрах склада.
          Проверьте правильность адреса.
        </p>
      </div>

      <div class="pt-4">
        <RouterLink
          to="/supplies"
          class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Вернуться на склад
        </RouterLink>
      </div>

      <div class="pt-12 flex justify-center gap-4 text-slate-300">
        <div class="w-2 h-2 rounded-full bg-current"></div>
        <div class="w-2 h-2 rounded-full bg-current"></div>
        <div class="w-2 h-2 rounded-full bg-current"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>

<style scoped>
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
.animate-pulse {
  animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
