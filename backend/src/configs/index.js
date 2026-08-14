import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 3000,
  db: {
    path: process.env.DB_PATH || "./database.sqlite",
  },
  cors: {
    allowedOrigins: process.env.CORS_ORIGIN || "*",
    allowedMethods: process.env.CORS_METHOD?.split(",") || ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  },
  jwtSecret: process.env.JWT_SECRET || "development-only-change-this-secret",
  uploadDir: process.env.UPLOAD_DIR || "./uploads",
};