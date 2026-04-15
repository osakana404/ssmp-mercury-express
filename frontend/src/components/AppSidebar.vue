<template>
  <aside
    class="w-64 bg-slate-900 h-screen sticky top-0 text-white p-4 flex flex-col border-r border-slate-800"
  >
    <div
      class="mb-8 font-bold text-xl text-center tracking-widest text-blue-400 shrink-0"
    >
      MERCURY
    </div>

    <nav class="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
      <div
        class="text-slate-500 text-[10px] uppercase font-bold px-4 mb-2 tracking-wider"
      >
        Склад
      </div>
      <RouterLink to="/settings" class="nav-link" active-class="active"
        >Справочники</RouterLink
      >
      <RouterLink to="/batches" class="nav-link" active-class="active"
        >Партии</RouterLink
      >
      <RouterLink to="/supplies" class="nav-link" active-class="active"
        >Приход товара</RouterLink
      >
      <RouterLink to="/disburse" class="nav-link" active-class="active"
        >Списание на авто</RouterLink
      >
      <RouterLink to="/transactions" class="nav-link" active-class="active"
        >Журнал операций</RouterLink
      >

      <div class="h-6"></div>

      <div
        class="text-slate-500 text-[10px] uppercase font-bold px-4 mb-2 tracking-wider"
      >
        Отчеты
      </div>
      <RouterLink to="/reports" class="nav-link" active-class="active"
        >Финансы</RouterLink
      >
    </nav>

    <div class="mt-auto pt-4 border-t border-slate-800 shrink-0 bg-slate-900">
      <a
        href="https://ssmp.mzsakha.ru"
        target="_blank"
        class="flex items-center gap-3 px-4 py-2 text-[11px] text-slate-400 hover:text-white transition group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-4 h-4 text-blue-500 group-hover:scale-110 transition"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m24.408-2.247A12.014 12.014 0 0 1 12 13.5c-2.235 0-4.32-.61-6.104-1.682"
          />
        </svg>
        <span>Официальный сайт</span>
      </a>

      <a
        href="https://github.com/osakana404/ssmp-mercury-express"
        target="_blank"
        class="flex items-center gap-3 px-4 py-2 text-[11px] text-slate-400 hover:text-white transition group"
      >
        <svg
          class="w-4 h-4 fill-current group-hover:scale-110 transition"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          ></path>
        </svg>
        <span>Помочь с разработкой</span>
      </a>

      <div class="px-4 pt-2 pb-2 text-[10px] text-slate-600 font-medium">
        ГБУ РС(Я) "ССМП" 2026 г.
      </div>
    </div>
  </aside>
</template>

<style scoped>
.nav-link {
  @apply block px-4 py-2.5 rounded-lg hover:bg-slate-800 transition text-sm text-slate-400;
}
.active {
  @apply bg-blue-600 text-white shadow-lg shadow-blue-900/40 font-semibold;
}

/* Стилизация скроллбара, чтобы он был тонким и красивым */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 10px;
}
</style>
