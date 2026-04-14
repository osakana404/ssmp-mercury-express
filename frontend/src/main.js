import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // Импорт нашего конфига
import "./style.css"; // Твой Tailwind

const app = createApp(App);
app.use(router); // Подключаем роутер к приложению
app.mount("#app");
