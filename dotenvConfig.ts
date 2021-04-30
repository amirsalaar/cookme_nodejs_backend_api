import dotenv from "dotenv";
import path from "path";

/**
 * production and development are running from ./dist/index.js --> we want to target the .env.* file in the root directory
 * tests are running from the root
 */
const baseDir = ["development", "production"].includes(process.env.NODE_ENV!)
  ? path.join(__dirname, ".env.")
  : path.join(__dirname, ".env.");

console.log(path.join(baseDir + process.env.NODE_ENV));

dotenv.config({
  path: path.join(baseDir + process.env.NODE_ENV),
  debug: process.env.NODE_ENV === "development" ? true : false,
});
