import app from "./app.js";
import { config } from "./configs/index.js";
import { sequelize } from "./configs/database.js";
import "./models/index.js";

async function start() {
  try {
    await sequelize.authenticate();
    console.log("Database connected.");
    app.listen(config.port, () => {
      console.log(`Library API running at http://localhost:${config.port}`);
    });
  } catch (err) {
    console.error("Unable to start server:", err);
    process.exit(1);
  }
}

start();