"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Supplies", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      supplierId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Suppliers", // Имя таблицы поставщиков
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT", // Не даем удалить поставщика, если есть поставки
      },
      docNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      totalSum: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Supplies");
  },
};
