import { Router } from "express";
import mongooseService from "./common/services/mongoose.service";
import Auth from "./auth";
import User from "./user";

const appRouter = (dbService: typeof mongooseService): Router => {
  const routes = Router();

  routes.use("/users", User(dbService));
  routes.use("/auth", Auth(dbService));

  return routes;
};

export default appRouter;
