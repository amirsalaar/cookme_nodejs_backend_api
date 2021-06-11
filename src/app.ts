import "../dotenvConfig";
import express from "express";
import { Server } from "node:http";
import swaggerUi from "swagger-ui-express";
import debug from "debug";
import cors from "cors";

import swaggerDoc from "./configs/swagger.json";
import { logger } from "./utils";
import { AuthRoutes } from "./auth/auth.routes.config";
import mongooseService from "./common/services/mongoose.service";
import User from "./user";

const debugLog: debug.IDebugger = debug("application");
const application = express();

function main(): Server {
  const dbService = mongooseService;

  application.use(cors());
  application.use(express.json());
  application.use(logger);
  application.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

  application.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials, token",
    );
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  });

  application.use("/users", User(dbService));

  return application.listen(process.env.PORT, () => {
    console.log(`Backend listening on port ${process.env.PORT}`);
  });
}

export default main;
