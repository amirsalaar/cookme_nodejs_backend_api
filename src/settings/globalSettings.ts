import dotenv from "dotenv";
import path from "path";

const baseDir = ["development", "test"].includes(process.env.NODE_ENV!)
  ? path.join(__dirname, "../../../.env.")
  : path.join(__dirname, "../../.env.");

dotenv.config({
  path: path.join(baseDir + process.env.NODE_ENV),
  debug: process.env.NODE_ENV === "development" ? true : false,
});
