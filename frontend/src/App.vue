<template>
  <div class="flex min-h-screen bg-slate-100">
    <AppSidebar />
    <main class="flex-1 p-8">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import AppSidebar from "./components/AppSidebar.vue";
</script>
