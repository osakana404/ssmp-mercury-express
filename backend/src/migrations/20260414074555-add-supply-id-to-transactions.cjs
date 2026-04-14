"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Transactions", "supplyId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "Supplies", // Имя таблицы в БД
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Transactions", "supplyId");
  },
};
