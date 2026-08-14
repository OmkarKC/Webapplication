import { DataTypes } from "sequelize";
import { sequelize } from "../configs/database.js";

export const Book = sequelize.define("Book", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(150), allowNull: false },
  stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  cover: { type: DataTypes.STRING, allowNull: true }
}, { tableName: "books", timestamps: true });