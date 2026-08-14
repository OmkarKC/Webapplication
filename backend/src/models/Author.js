import { DataTypes } from "sequelize";
import { sequelize } from "../configs/database.js";

export const Author = sequelize.define("Author", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  bio: { type: DataTypes.TEXT, allowNull: true }
}, { tableName: "authors", timestamps: true });