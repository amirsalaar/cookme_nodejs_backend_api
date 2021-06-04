import { Router } from "express";
import userRoutes from "./user.route";

const routes = Router();

routes.use(userRoutes);

export default routes;
