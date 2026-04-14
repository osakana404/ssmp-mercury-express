<template>
  <div>
    <label v-if="label" class="block mb-2 text-sm font-medium">{{
      label
    }}</label>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      class="w-full rounded border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: [String, Number],
  label: String,
  type: { type: String, default: "text" },
  placeholder: String,
});
defineEmits(["update:modelValue"]);
</script>
