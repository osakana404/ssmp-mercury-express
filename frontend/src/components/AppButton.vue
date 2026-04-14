<template>
  <button
    :type="type"
    class="rounded px-4 py-2 font-medium transition"
    :class="variantClass"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  type: { type: String, default: "button" },
  variant: { type: String, default: "primary" },
});

const variantClass = computed(() => {
  if (props.variant === "secondary")
    return "bg-slate-200 text-slate-900 hover:bg-slate-300";
  if (props.variant === "danger")
    return "bg-red-600 text-white hover:bg-red-700";
  if (props.variant === "success")
    return "bg-green-600 text-white hover:bg-green-700";
  return "bg-blue-600 text-white hover:bg-blue-700";
});
</script>
