<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        @click.self="$emit('update:modelValue', false)"
      >
        <Transition name="zoom">
          <div
            v-if="modelValue"
            class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div
              class="px-6 py-4 border-b flex justify-between items-center bg-slate-50"
            >
              <h3 class="text-xl font-bold text-slate-800">{{ title }}</h3>
              <button
                @click="$emit('update:modelValue', false)"
                class="text-slate-400 hover:text-slate-600 text-2xl transition"
              >
                &times;
              </button>
            </div>

            <div class="p-6">
              <slot />
            </div>

            <div
              v-if="$slots.footer"
              class="px-6 py-4 border-t bg-slate-50 flex justify-end gap-3"
            >
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  title: { type: String, default: "Уведомление" },
});
defineEmits(["update:modelValue"]);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.zoom-enter-active,
.zoom-leave-active {
  transition:
    transform 0.3s,
    opacity 0.3s;
}
.zoom-enter-from,
.zoom-leave-to {
  transform: scale(0.95);
  opacity: 0;
}
</style>
