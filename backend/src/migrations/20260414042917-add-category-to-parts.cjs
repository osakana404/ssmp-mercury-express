"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Parts", "categoryId", {
      type: Sequelize.INTEGER,
      allowNull: true, // Разрешаем null на случай, если есть запчасти без категории
      references: {
        model: "PartCategories", // Имя таблицы, к которой привязываемся
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL", // Если категория удалится, у запчасти просто занулится поле
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Parts", "categoryId");
  },
};
