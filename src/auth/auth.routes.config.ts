import { Application } from "express";
import { body } from "express-validator";
import { CommonRoutesConfig } from "../common/common.routes.config";
import authController from "./controllers/auth.controller";
import authMiddleware from "./middleware/auth.middleware";
import bodyValidationMiddleware from "../common/middleware/body.validation.middleware";

export class AuthRoutes extends CommonRoutesConfig {
  constructor(app: Application, nameSpace: string | undefined = "/api/v2") {
    super(app, "AuthRoutes", nameSpace);
  }

  configureRoutes(): Application {
    this.app.post(this.getAbsolutePath("/auth"), [
      body("email").isEmail(),
      body("password").isString(),
      bodyValidationMiddleware.verifyBodyFieldsErrors,
      authMiddleware.verifyUserPassword,
      authController.createJWT,
    ]);
    return this.app;
  }
}
