"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("News", "categoryId", {
      type: Sequelize.INTEGER,
      foreignKey: true,
      // цепочка связывающая таблицы
      references: {
        model: "Category",
        key: "id",
      },
      onUpdate: "CASCADE", //если ID категории изменится, он изменится и во всех новостях (редко, но полезно).
      onDelete: "SET NULL", //категория удалится, а у новостей в поле categoryId станет NULL (новости останутся).
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("News", "categoryId");
  },
};
