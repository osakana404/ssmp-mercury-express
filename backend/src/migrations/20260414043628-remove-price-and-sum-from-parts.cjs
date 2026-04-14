"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Отключаем проверку внешних ключей
    await queryInterface.sequelize.query("PRAGMA foreign_keys = OFF");

    try {
      // 2. Удаляем колонки
      await queryInterface.removeColumn("Parts", "price");
      await queryInterface.removeColumn("Parts", "sum");
    } finally {
      // 3. Включаем проверку обратно в любом случае
      await queryInterface.sequelize.query("PRAGMA foreign_keys = ON");
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("Parts", "price", {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    });
    await queryInterface.addColumn("Parts", "sum", {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    });
  },
};
