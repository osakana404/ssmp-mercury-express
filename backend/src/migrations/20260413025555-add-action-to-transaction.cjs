"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Transactions", "action", {
      type: Sequelize.ENUM("create", "increment"),
      allowNull: false,
      defaultValue: "increment",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Transactions", "action");
  },
};
