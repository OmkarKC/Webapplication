export function HandleNotFound(req, res) {
  res.status(404).json({ error: "Route not found" });
}

export function HandleError(err, req, res, next) {
  console.error(err);

  if (err?.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({ error: "A record with that value already exists." });
  }
  if (err?.name === "SequelizeValidationError") {
    return res.status(400).json({
      error: "Validation failed",
      data: err.errors.map(e => ({ field: e.path, message: e.message }))
    });
  }
  if (err?.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "Cover image is too large. Maximum size is 5 MB." });
  }
  if (err?.message === "Only JPEG, PNG, WEBP, and GIF images are allowed.") {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: "Internal server error" });
}