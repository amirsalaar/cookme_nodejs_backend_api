import { NextFunction, Request, Response, Router } from "express";
import debug from "debug";
import { body } from "express-validator";
import bcrypt from "bcrypt";
import { UsersService } from "./service";
import JwtMiddleware from "src/auth/middleware/jwt.middleware";
import commonPermissionMiddleware from "src/common/middleware/common.permission.middleware";
import { PermissionFlag } from "src/common/middleware/common.permissionflag.enum";
import bodyValidationMiddleware from "src/common/middleware/body.validation.middleware";
import UserMiddleware from "./middleware";

const log: debug.IDebugger = debug("app:users-controller");
const SALT_ROUNDS = 10;

const usersController = (usersService: UsersService): Router => {
  const router = Router();
  const usersMiddleware = UserMiddleware(usersService);
  const jwtMiddleware = JwtMiddleware(usersService);

  const getUserById = async (req: Request, res: Response) => {
    const user = await usersService.getById(req.body.id);
    res.status(200).send(user);
  };

  const removeUser = async (req: Request, res: Response) => {
    log(await usersService.deleteById(req.body.id));
    res.status(204).send();
  };

  const putUser = async (req: Request, res: Response) => {
    req.body.password = await bcrypt.hash(req.body.password, 16);
    log(await usersService.putById(req.body.id, req.body));
    res.status(204).send();
  };

  const patchUser = async (req: Request, res: Response) => {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 16);
    }
    log(await usersService.patchById(req.body.id, req.body));
    res.status(204).send();
  };

  router
    .route("/")
    .get(
      jwtMiddleware.validJWTNeeded,
      commonPermissionMiddleware.permissionFlagRequired(
        PermissionFlag.ADMIN_PERMISSION,
      ),
      async (_req: Request, res: Response, next: NextFunction) => {
        try {
          const users = await usersService.list(100, 0);
          res.status(200).send(users);
        } catch (error) {
          next(error);
        }
      },
    )
    .post(
      body("email").isEmail(),
      body("password")
        .isLength({ min: 6 })
        .withMessage("Must include password more than six characters"),
      bodyValidationMiddleware.verifyBodyFieldsErrors,
      usersMiddleware.validateSameEmailDoesntExist,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const salt = await bcrypt.genSalt(SALT_ROUNDS);
          req.body.password = await bcrypt.hash(req.body.password, salt);

          const userId = await usersService.create(req.body);
          res.status(201).send({ id: userId });
        } catch (error) {
          next(error);
        }
      },
    );

  router.param("userId", usersMiddleware.extractUserId);

  router
    .route("/userId")
    .all(
      usersMiddleware.validateUserExists,
      jwtMiddleware.validJWTNeeded,
      commonPermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
    )
    .get(getUserById)
    .delete(removeUser);

  router
    .route("/userId")
    .put([
      body("email").isEmail(),
      body("password")
        .isLength({ min: 6 })
        .withMessage("Must include password more than six characters"),
      body("firstName").isString(),
      body("lastName").isString(),
      body("permissionFlags").isInt(),
      bodyValidationMiddleware.verifyBodyFieldsErrors,
      usersMiddleware.validateSameEmailBelongsToSameUser,
      usersMiddleware.userCantChangePermission,
      putUser,
    ]);

  router
    .route("/userId")
    .patch([
      body("email").isEmail().optional(),
      body("password")
        .isLength({ min: 6 })
        .withMessage("Must include password more than six characters")
        .optional(),
      body("firstName").isString().optional(),
      body("lastName").isString().optional(),
      body("permissionFlags").isInt().optional(),
      bodyValidationMiddleware.verifyBodyFieldsErrors,
      usersMiddleware.userCantChangePermission,
      patchUser,
    ]);

  return router;
};

export default usersController;
