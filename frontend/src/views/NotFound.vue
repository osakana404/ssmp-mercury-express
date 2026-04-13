<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-100 px-4">
    <div class="text-center">
      <div class="text-7xl font-bold text-slate-300">404</div>
      <h1 class="mt-4 text-2xl font-bold">Страница не найдена</h1>
      <p class="mt-2 text-slate-600">Похоже, такой страницы в панели нет.</p>
      <RouterLink
        to="/"
        class="mt-6 inline-block rounded bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
      >
        Вернуться на дашборд
      </RouterLink>
    </div>
  </div>
</template>
