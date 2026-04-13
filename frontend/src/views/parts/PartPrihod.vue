<template>
  <div class="max-w-2xl">
    <h2 class="text-2xl font-bold mb-6">Оприходовать запчасть</h2>

    <form
      class="bg-white rounded-xl shadow p-6 space-y-4"
      @submit.prevent="submit"
    >
      <AppInput v-model="form.name" label="Название" />
      <AppInput
        v-model.number="form.quantity"
        label="Количество"
        type="number"
      />
      <AppInput v-model.number="form.price" label="Цена" type="number" />
      <AppInput v-model="form.description" label="Описание" />

      <AppButton type="submit" variant="success">Сохранить</AppButton>
    </form>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { createPrihod } from "@/api/parts";
import AppInput from "@/components/ui/AppInput.vue";
import AppButton from "@/components/ui/AppButton.vue";

const router = useRouter();

const form = reactive({
  name: "",
  quantity: 1,
  price: 0,
  description: "",
});

const submit = async () => {
  await createPrihod(form);
  router.push("/parts");
};
</script>
