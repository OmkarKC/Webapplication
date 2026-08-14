import bcrypt from "bcrypt";
import { sequelize } from "../configs/database.js";
import { User, Author, Genre, Book } from "../models/index.js";

async function seed() {
  await sequelize.sync({ alter: true });

  const existingAdmin = await User.findOne({ where: { username: "admin" } });
  if (!existingAdmin) {
    await User.create({
      firstName: "System",
      lastName: "Admin",
      username: "admin",
      passwordHash: await bcrypt.hash("admin123", 12)
    });
    console.log("Seeded admin user: admin / admin123");
  }

  const genres = [
    ["Thriller"], ["Fantasy"], ["Non-Fiction"], ["Sci-Fi"]
  ];
  for (const [name] of genres) await Genre.findOrCreate({ where: { name }, defaults: { name } });

  const authors = [
    ["Alex Michaelides", "Author of psychological thrillers."],
    ["Brandon Sanderson", "Prolific epic fantasy author."],
    ["Yuval Noah Harari", "Historian and author of Sapiens."],
    ["Patrick Rothfuss", "Author of The Kingkiller Chronicle."],
    ["Frank Herbert", "Author of the Dune saga."],
    ["Gillian Flynn", "Author of dark psychological thrillers."],
    ["Tara Westover", "Memoirist, author of Educated."],
    ["Andy Weir", "Science fiction author known for The Martian."]
  ];
  for (const [name, bio] of authors) await Author.findOrCreate({ where: { name }, defaults: { name, bio } });

  const authorMap = Object.fromEntries((await Author.findAll()).map(a => [a.name, a.id]));
  const genreMap = Object.fromEntries((await Genre.findAll()).map(g => [g.name, g.id]));
  const books = [
    ["The Silent Patient", "Alex Michaelides", "Thriller", 12],
    ["Mistborn", "Brandon Sanderson", "Fantasy", 3],
    ["Sapiens", "Yuval Noah Harari", "Non-Fiction", 8],
    ["The Name of the Wind", "Patrick Rothfuss", "Fantasy", 2],
    ["Dune", "Frank Herbert", "Sci-Fi", 15],
    ["Gone Girl", "Gillian Flynn", "Thriller", 4],
    ["Educated", "Tara Westover", "Non-Fiction", 7],
    ["Project Hail Mary", "Andy Weir", "Sci-Fi", 1]
  ];
  for (const [title, author, genre, stock] of books) {
    await Book.findOrCreate({
      where: { title },
      defaults: { title, authorId: authorMap[author], genreId: genreMap[genre], stock }
    });
  }
}

seed().then(() => {
  console.log("Database synchronized and seeded.");
  process.exit(0);
}).catch(err => {
  console.error("Database sync failed:", err);
  process.exit(1);
});