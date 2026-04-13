<template>
  <div class="max-w-2xl">
    <h2 class="text-2xl font-bold mb-6">Списать запчасть</h2>

    <form
      class="bg-white rounded-xl shadow p-6 space-y-4"
      @submit.prevent="submit"
    >
      <AppInput
        v-model.number="form.partId"
        label="ID запчасти"
        type="number"
      />
      <AppInput v-model.number="form.carId" label="ID машины" type="number" />
      <AppInput
        v-model.number="form.quantity"
        label="Количество"
        type="number"
      />

      <AppButton type="submit" variant="danger">Списать</AppButton>
    </form>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { createSpisanie } from "@/api/parts";
import AppInput from "@/components/ui/AppInput.vue";
import AppButton from "@/components/ui/AppButton.vue";

const router = useRouter();

const form = reactive({
  partId: 1,
  carId: 1,
  quantity: 1,
});

const submit = async () => {
  await createSpisanie(form);
  router.push("/transactions");
};
</script>
