<template>
  <aside class="w-64 bg-slate-900 min-h-screen text-white p-4">
    <div class="mb-8 font-bold text-xl text-center">MERCURY</div>

    <nav class="space-y-2">
      <div class="text-slate-500 text-[10px] uppercase font-bold px-4 mb-2">
        Склад
      </div>
      <RouterLink to="/settings" class="block p-3 hover:bg-slate-800 rounded"
        >Справочники</RouterLink
      >
      <RouterLink to="/batches" class="block p-3 hover:bg-slate-800 rounded"
        >Партии</RouterLink
      >
      <RouterLink to="/supplies" class="block p-3 hover:bg-slate-800 rounded"
        >Приход товара</RouterLink
      >
      <RouterLink to="/disburse" class="block p-3 hover:bg-slate-800 rounded"
        >Списание на авто</RouterLink
      >
      <RouterLink
        to="/transactions"
        class="block p-3 hover:bg-slate-800 rounded"
        >Журнал операций</RouterLink
      >

      <div class="h-4"></div>

      <div class="text-slate-500 text-[10px] uppercase font-bold px-4 mb-2">
        Отчеты
      </div>
      <RouterLink to="/reports" class="block p-3 hover:bg-slate-800 rounded"
        >Финансы</RouterLink
      >
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
