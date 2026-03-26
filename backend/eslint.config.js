import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    // Что игнорировать
    ignores: [
      "node_modules/",
      "dist/",
      "build/",
      "coverage/",
      ".git/",
      "*.min.js",
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: {
        ...globals.node, // Добавляем Node.js глобальные переменные
        ...globals.es2021, // Добавляем ES2021 глобальные переменные
      },
      ecmaVersion: 2022, // Указываем версию ECMAScript
      sourceType: "module", // Указываем что используем ES-модули
    },
    rules: {
      // Опционально: отключаем правило для console.log
      "no-console": "off",
      // Опционально: предупреждения для неиспользуемых переменных
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
]);
