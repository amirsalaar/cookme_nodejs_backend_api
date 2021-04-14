import { Router } from "express";
import { UsersController } from "../controllers/UsersController";

const userRoutes = Router();

userRoutes.get("/users", UsersController.createUser);

export default userRoutes;
