import express from "express";
import { Server } from "node:http";
import swaggerUi from "swagger-ui-express";
import DatabsePool from "./db/DbClient";
import routes from "./routes";
import swaggerDoc from "./configs/swagger.json";

function run(): Server {
  const app = express();

  const dbInstance = DatabsePool.getInstance();

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

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

  app.use("/api/v1", routes);

  return app.listen(process.env.PORT, () =>
    console.log(`Backend listening on port ${process.env.PORT}`),
  );
}

export default { run };
