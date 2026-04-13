<template>
  <div class="min-h-screen bg-slate-100 text-slate-900">
    <aside class="fixed inset-y-0 left-0 w-64 bg-slate-900 text-white p-4">
      <div class="text-xl font-bold mb-8">mercury</div>

      <nav class="space-y-2">
        <RouterLink to="/" class="nav-link">Дашборд</RouterLink>
        <RouterLink to="/news" class="nav-link">Новости</RouterLink>
        <RouterLink to="/parts" class="nav-link">Запчасти</RouterLink>
        <RouterLink to="/transactions" class="nav-link">Транзакции</RouterLink>
      </nav>
    </aside>

    <div class="ml-64">
      <header
        class="h-16 bg-white border-b flex items-center justify-between px-6"
      >
        <h1 class="text-lg font-semibold">Корпоративный веб-ресурс ССМП</h1>
        <a
          href="https://ssmp.mzsakha.ru"
          target="_blank"
          rel="noopener noreferrer"
          class="group flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-100 to-slate-200 px-4 py-2 text-blue-700 hover:from-blue-200 hover:to-blue-300 hover:shadow-md transition-all duration-200"
          title="Официальный сайт ССМП"
        >
          <!-- <svg
            class="h-5 w-5 group-hover:-translate-y-0.5 transition-transform duration-200"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fill-rule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clip-rule="evenodd"
            />
          </svg> -->
          <span class="font-medium hidden sm:inline">Наш официальный сайт</span>
        </a>

        <a
          href="https://github.com/osakana404/ssmp-mercury-express"
          target="_blank"
          rel="noopener noreferrer"
          class="group flex items-center gap-2 rounded-lg bg-gradient-to-r from-slate-100 to-slate-200 px-4 py-2 text-slate-700 hover:from-slate-200 hover:to-slate-300 hover:shadow-md transition-all duration-200"
          title="Помочь с разработкой на GitHub"
        >
          <svg
            class="h-5 w-5 group-hover:-translate-y-0.5 transition-transform duration-200"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fill-rule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="font-medium hidden sm:inline">Помочь с разработкой</span>
        </a>
      </header>

      <main class="p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.nav-link {
  @apply block rounded px-3 py-2 transition hover:bg-slate-800;
}
.nav-link.router-link-active,
.nav-link.router-link-exact-active {
  @apply bg-blue-600 text-white;
}
</style>
