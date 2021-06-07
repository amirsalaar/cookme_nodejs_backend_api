import express from "express";
import { Server } from "node:http";
import swaggerUi from "swagger-ui-express";
import debug from "debug";
import cors from "cors";

import swaggerDoc from "./configs/swagger.json";
import { logger } from "./utils";
import { CommonRoutesConfig } from "./common/common.routes.config";
import { UsersRoutes } from "./users/users.routes.config";
import { AuthRoutes } from "./auth/auth.routes.config";

const app = express();
const debugLog: debug.IDebugger = debug("app");
const routes: Array<CommonRoutesConfig> = []; // for debugging purpose

app.use(cors());
app.use(express.json());
app.use(logger);

app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials, token",
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

routes.push(new UsersRoutes(app), new AuthRoutes(app));

export const appRunner = (): Server =>
  app.listen(process.env.PORT, () => {
    routes.forEach((route) => {
      debugLog(`Routes configured for ${route.getName()}`);
    });

    console.log(`Backend listening on port ${process.env.PORT}`);
  });
