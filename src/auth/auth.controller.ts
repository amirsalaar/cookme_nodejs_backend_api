import { Request, Response, Router } from "express";
import { body } from "express-validator";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import debug from "debug";
import bodyValidationMiddleware from "../common/middleware/body.validation.middleware";
import AuthMiddleware from "./middleware/auth.middleware";
import JwtMiddleware from "./middleware/jwt.middleware";
import { UsersService } from "src/user/service";

const log: debug.IDebugger = debug("app:auth-controller");

const JWT_SECRET = process.env.JWT_SECRET!;
const tokenExpirationInSeconds = 36000;

const authController = (userService: UsersService): Router => {
  const router = Router();
  const authMiddleware = AuthMiddleware(userService);
  const jwtMiddleware = JwtMiddleware(userService);

  const createJWT = async (req: Request, res: Response) => {
    try {
      const refreshId = req.body.userId + JWT_SECRET;
      const salt = crypto.createSecretKey(crypto.randomBytes(16));
      const hash = crypto
        .createHmac("sha512", salt)
        .update(refreshId)
        .digest("base64");

      req.body.refreshKey = salt.export();
      const token = jwt.sign(req.body, JWT_SECRET, {
        expiresIn: tokenExpirationInSeconds,
      });

      return res.status(201).send({ accessToken: token, refreshToken: hash });
    } catch (err) {
      log("createJWT error: ", err);
      return res.status(500).send();
    }
  };

  router
    .route("/")
    .post([
      body("email").isEmail(),
      body("password").isString(),
      bodyValidationMiddleware.verifyBodyFieldsErrors,
      authMiddleware.verifyUserPassword,
      createJWT,
    ]);

  router
    .route("/refresh-token")
    .post([
      jwtMiddleware.validJWTNeeded,
      jwtMiddleware.verifyRefreshBodyField,
      jwtMiddleware.validRefreshNeeded,
      createJWT,
    ]);

  return router;
};

export default authController;

/**
 * login
 */
// public async login(req: Request, res: Response) {
//   const { username, password } = req.body;
//   if (!username && password) {
//     return res.status(400).send();
//   }

//   const userRepo = new UserRepository();
//   let user: User;
//   try {
//     user = await userRepo.getUserByUsername(username);
//   } catch (error) {
//     return res.status(401).send();
//   }

//   if (!user.checkIfUnencryptedPasswordIsValid(password)) {
//     return res.status(401).send();
//   }

//   const token = user.generateAuthToken(user);

//   res.json(token);
// }
