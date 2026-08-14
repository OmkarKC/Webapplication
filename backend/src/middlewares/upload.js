import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { config } from "../configs/index.js";

fs.mkdirSync(config.uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, config.uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`);
  }
});

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export const uploadCover = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!allowedTypes.has(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG, WEBP, and GIF images are allowed."));
    }
    cb(null, true);
  }
}).single("cover");