import express from "express";
import { setupApp } from "./setup-app";
import { runDB } from "./db/mongo.db";
import "./config";

const app = express();
setupApp(app);

const TEST_PORT = process.env.TEST_PORT;
const PORT = process.env.PORT || 3003;

console.log("TEST ENV: " + TEST_PORT);

export const startApp = async () => {
  await runDB();

  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
};

startApp();

module.exports = app;
