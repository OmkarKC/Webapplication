import { Genre, Book } from "../models/index.js";

export async function getGenres(_req, res, next) {
  try { res.json(await Genre.findAll({ order: [["name", "ASC"]] })); } catch (err) { next(err); }
}

export async function getGenreById(req, res, next) {
  try {
    const genre = await Genre.findByPk(req.params.id);
    if (!genre) return res.status(404).json({ error: "Genre not found." });
    res.json(genre);
  } catch (err) { next(err); }
}

export async function createGenre(req, res, next) {
  try {
    const genre = await Genre.create({ name: req.body.name.trim() });
    res.status(201).json(genre);
  } catch (err) { next(err); }
}

export async function updateGenre(req, res, next) {
  try {
    const genre = await Genre.findByPk(req.params.id);
    if (!genre) return res.status(404).json({ error: "Genre not found." });
    await genre.update({ name: req.body.name.trim() });
    res.json(genre);
  } catch (err) { next(err); }
}

export async function deleteGenre(req, res, next) {
  try {
    const genre = await Genre.findByPk(req.params.id);
    if (!genre) return res.status(404).json({ error: "Genre not found." });
    const count = await Book.count({ where: { genreId: genre.id } });
    if (count) return res.status(409).json({ error: "This genre is linked to one or more books and cannot be deleted." });
    await genre.destroy();
    res.status(204).send();
  } catch (err) { next(err); }
}