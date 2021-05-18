import { Router } from "express";
import auth from "../middlewares/Auth";
import { UsersController } from "../controllers/UsersController";

const userRoutes = Router();
const userController = new UsersController();

userRoutes.get("/users/:id", auth, userController.getUserById);

export default userRoutes;
