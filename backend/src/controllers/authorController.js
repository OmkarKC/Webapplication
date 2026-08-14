import { Author, Book } from "../models/index.js";

export async function getAuthors(_req, res, next) {
  try { res.json(await Author.findAll({ order: [["name", "ASC"]] })); } catch (err) { next(err); }
}

export async function getAuthorById(req, res, next) {
  try {
    const author = await Author.findByPk(req.params.id);
    if (!author) return res.status(404).json({ error: "Author not found." });
    res.json(author);
  } catch (err) { next(err); }
}

export async function createAuthor(req, res, next) {
  try {
    const { name, bio } = req.body;
    const author = await Author.create({ name: name.trim(), bio: bio?.trim() || null });
    res.status(201).json(author);
  } catch (err) { next(err); }
}

export async function updateAuthor(req, res, next) {
  try {
    const author = await Author.findByPk(req.params.id);
    if (!author) return res.status(404).json({ error: "Author not found." });
    await author.update({ name: req.body.name.trim(), bio: req.body.bio?.trim() || null });
    res.json(author);
  } catch (err) { next(err); }
}

export async function deleteAuthor(req, res, next) {
  try {
    const author = await Author.findByPk(req.params.id);
    if (!author) return res.status(404).json({ error: "Author not found." });
    const count = await Book.count({ where: { authorId: author.id } });
    if (count) return res.status(409).json({ error: "This author is linked to one or more books and cannot be deleted." });
    await author.destroy();
    res.status(204).send();
  } catch (err) { next(err); }
}