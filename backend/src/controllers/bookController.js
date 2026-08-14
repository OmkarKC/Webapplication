import fs from "fs/promises";
import path from "path";
import { Book, Author, Genre } from "../models/index.js";
import { Op } from "sequelize";
import { config } from "../configs/index.js";

const include = [
  { model: Author, attributes: ["id", "name", "bio"] },
  { model: Genre, attributes: ["id", "name"] }
];

function withCoverUrl(book, req) {
  const data = book.toJSON();
  data.coverUrl = data.cover ? `${req.protocol}://${req.get("host")}/uploads/${data.cover}` : null;
  return data;
}

export async function getBooks(req, res, next) {
  try {
    const where = {};
    if (req.query.title?.trim()) where.title = { [Op.like]: `%${req.query.title.trim()}%` };
    if (req.query.genreId) where.genreId = Number(req.query.genreId);

    const books = await Book.findAll({ where, include, order: [["title", "ASC"]] });
    res.json(books.map(b => withCoverUrl(b, req)));
  } catch (err) { next(err); }
}

export async function getBookById(req, res, next) {
  try {
    const book = await Book.findByPk(req.params.id, { include });
    if (!book) return res.status(404).json({ error: "Book not found." });
    res.json(withCoverUrl(book, req));
  } catch (err) { next(err); }
}

export async function createBook(req, res, next) {
  try {
    const { title, authorId, genreId, stock } = req.body;
    const book = await Book.create({
      title: title.trim(),
      authorId: Number(authorId),
      genreId: Number(genreId),
      stock: Number(stock),
      cover: req.file?.filename || null
    });
    const result = await Book.findByPk(book.id, { include });
    res.status(201).json(withCoverUrl(result, req));
  } catch (err) { next(err); }
}

export async function updateBook(req, res, next) {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found." });

    const oldCover = book.cover;
    const updates = {};
    for (const key of ["title", "authorId", "genreId", "stock"]) {
      if (req.body[key] !== undefined) updates[key] = key === "stock" || key.endsWith("Id") ? Number(req.body[key]) : req.body[key].trim();
    }
    if (req.file) updates.cover = req.file.filename;

    await book.update(updates);

    if (req.file && oldCover) {
      await fs.unlink(path.join(config.uploadDir, oldCover)).catch(() => {});
    }

    const result = await Book.findByPk(book.id, { include });
    res.json(withCoverUrl(result, req));
  } catch (err) { next(err); }
}

export async function deleteBook(req, res, next) {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found." });
    if (book.cover) await fs.unlink(path.join(config.uploadDir, book.cover)).catch(() => {});
    await book.destroy();
    res.status(204).send();
  } catch (err) { next(err); }
}