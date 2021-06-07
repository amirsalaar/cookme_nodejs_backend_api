import { Application } from "express";
import { body } from "express-validator";
import bodyValidationMiddleware from "../common/middleware/body.validation.middleware";
import { CommonRoutesConfig } from "../common/common.routes.config";
import usersController from "./controllers/users.controller";
import usersMiddleware from "./middleware/users.middleware";
import jwtMiddleware from "../auth/middleware/jwt.middleware";
import permissionMiddleware from "../common/middleware/common.permission.middleware";
import { PermissionFlag } from "../common/middleware/common.permissionflag.enum";

export class UsersRoutes extends CommonRoutesConfig {
  constructor(app: Application, nameSpace: string | undefined = "/api/v2") {
    super(app, "UsersRoutes", nameSpace);
  }

  public configureRoutes(): Application {
    this.app
      .route(this.getAbsolutePath("/users"))
      .get(
        jwtMiddleware.validJWTNeeded,
        permissionMiddleware.permissionFlagRequired(
          PermissionFlag.ADMIN_PERMISSION,
        ),
        usersController.listUsers,
      )
      .post(
        body("email").isEmail(),
        body("password")
          .isLength({ min: 6 })
          .withMessage("Must include password more than six characters"),
        bodyValidationMiddleware.verifyBodyFieldsErrors,
        usersMiddleware.validateSameEmailDoesntExist,
        usersController.createUser,
      );

    this.app.param("userId", usersMiddleware.extractUserId);

    this.app
      .route(this.getAbsolutePath("/users/:userId"))
      .all(
        usersMiddleware.validateUserExists,
        jwtMiddleware.validJWTNeeded,
        permissionMiddleware.onlySameUserOrAdminCanDoThisAction,
      );

    this.app
      .route(this.getAbsolutePath("/users/:userId"))
      .get(usersController.getUserById)
      .delete(usersController.removeUser);

    this.app.put(this.getAbsolutePath("/users/:userId"), [
      body("email").isEmail(),
      body("password")
        .isLength({ min: 6 })
        .withMessage("Must include password more than six characters"),
      body("firstName").isString(),
      body("lastName").isString(),
      body("permissionFlags").isInt(),
      bodyValidationMiddleware.verifyBodyFieldsErrors,
      usersMiddleware.validateSameEmailBelongsToSameUser,
      usersController.put,
    ]);

    this.app.patch(this.getAbsolutePath("/users/:userId"), [
      body("email").isEmail().optional(),
      body("password")
        .isLength({ min: 6 })
        .withMessage("Must include password more than six characters")
        .optional(),
      body("firstName").isString().optional(),
      body("lastName").isString().optional(),
      body("permissionFlags").isInt().optional(),
      bodyValidationMiddleware.verifyBodyFieldsErrors,
      usersController.patch,
    ]);

    return this.app;
  }
}
