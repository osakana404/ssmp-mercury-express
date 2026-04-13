"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.changeColumn("Cars", "description", {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: "Нет описания",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Cars", "description", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },
};
