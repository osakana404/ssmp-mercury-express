<template>
  <div>
    <label v-if="label" class="block mb-2 text-sm font-medium">{{
      label
    }}</label>
    <textarea
      :value="modelValue"
      :rows="rows"
      class="w-full rounded border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
  label: String,
  rows: { type: Number, default: 5 },
});
defineEmits(["update:modelValue"]);
</script>
