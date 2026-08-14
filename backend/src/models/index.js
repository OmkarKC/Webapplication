import User from "./User.js";
import { Author } from "./Author.js";
import { Genre } from "./Genre.js";
import { Book } from "./Book.js";

Author.hasMany(Book, { foreignKey: { name: "authorId", allowNull: false }, onDelete: "RESTRICT" });
Book.belongsTo(Author, { foreignKey: { name: "authorId", allowNull: false } });

Genre.hasMany(Book, { foreignKey: { name: "genreId", allowNull: false }, onDelete: "RESTRICT" });
Book.belongsTo(Genre, { foreignKey: { name: "genreId", allowNull: false } });

export { User, Author, Genre, Book };