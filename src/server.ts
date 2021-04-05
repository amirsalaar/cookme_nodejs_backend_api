import express from "express";
import { Server } from "node:http";
import pool from "./db/dbPool";

function run(): Server {
  const app = express();

  pool.connect((err) => {
    if (err) console.log("Error connecting to DB", err);
    else console.log("Connected to DB");
  });

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials, token",
    );
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  });

  return app.listen(process.env.PORT, () =>
    console.log(`Backend listening on port ${process.env.PORT}`),
  );
}

export default { run };
