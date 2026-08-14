import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import authorRoutes from "./routes/authorRoutes.js";
import genreRoutes from "./routes/genreRoutes.js";
import { config } from "./configs/index.js";
import { HandleError, HandleNotFound } from "./middlewares/errorHandler.js";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadAbsolute = path.resolve(__dirname, "..", config.uploadDir);

app.use(cors({
  origin: config.cors.allowedOrigins,
  methods: config.cors.allowedMethods
}));
app.use(express.json());
app.use("/uploads", express.static(uploadAbsolute));

app.get("/", (_req, res) => res.json({
  message: "Library Management System API",
  status: "running"
}));

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/authors", authorRoutes);
app.use("/api/genres", genreRoutes);

app.use(HandleNotFound);
app.use(HandleError);

export default app;