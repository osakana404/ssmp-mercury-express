<template>
  <div class="max-w-3xl">
    <h2 class="text-2xl font-bold mb-6">Создать новость</h2>

    <form
      class="bg-white rounded-xl shadow p-6 space-y-4"
      @submit.prevent="submit"
    >
      <div>
        <label class="block mb-2 text-sm font-medium">Заголовок</label>
        <input v-model="form.title" class="w-full rounded border px-3 py-2" />
      </div>

      <div>
        <label class="block mb-2 text-sm font-medium">Категория ID</label>
        <input
          v-model.number="form.categoryId"
          type="number"
          class="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label class="block mb-2 text-sm font-medium">Контент</label>
        <textarea
          v-model="form.content"
          rows="8"
          class="w-full rounded border px-3 py-2"
        ></textarea>
      </div>

      <div>
        <label class="block mb-2 text-sm font-medium">Файлы</label>
        <input type="file" multiple @change="onFilesChange" />
      </div>

      <button
        class="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
      >
        Сохранить
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { createNews } from "@/api/news";

const router = useRouter();

const form = reactive({
  title: "",
  content: "",
  categoryId: 1,
  files: [],
});

const onFilesChange = (e) => {
  form.files = Array.from(e.target.files || []);
};

const submit = async () => {
  await createNews(form);
  router.push("/news");
};
</script>
