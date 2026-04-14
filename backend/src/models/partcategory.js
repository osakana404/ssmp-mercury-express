import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const PartCategory = sequelize.define(
  "PartCategory",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  { tableName: "PartCategories", timestamps: true },
);

export default PartCategory;
