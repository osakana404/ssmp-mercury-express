<template>
  <aside
    class="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col shadow-xl"
  >
    <div
      class="p-6 text-white font-bold text-2xl border-b border-slate-800 uppercase tracking-widest"
    >
      Mercury <span class="text-blue-500 font-black">SSMP</span>
    </div>
    <nav class="flex-1 p-4 space-y-2">
      <RouterLink to="/" class="nav-link" active-class="active">
        🏠 Дашборд
      </RouterLink>
      <RouterLink to="/parts" class="nav-link" active-class="active">
        ⚙️ Запчасти
      </RouterLink>
      <RouterLink to="/batches" class="nav-link" active-class="active">
        📦 Партии (Batch)
      </RouterLink>
      <RouterLink to="/transactions" class="nav-link" active-class="active">
        🔄 Транзакции
      </RouterLink>
      <RouterLink to="/reports" class="nav-link" active-class="active">
        📊 Отчеты (Финансы)
      </RouterLink>
    </nav>
  </aside>
</template>

<style scoped>
.nav-link {
  @apply flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition text-sm;
}
.active {
  @apply bg-blue-600 text-white shadow-lg shadow-blue-900/20;
}
</style>
