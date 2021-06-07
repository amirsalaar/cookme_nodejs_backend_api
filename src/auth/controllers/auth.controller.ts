import { Request, Response } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import debug from "debug";

const log: debug.IDebugger = debug("app:auth-controller");

const JWT_SECRET = process.env.JWT_SECRET!;
const tokenExpirationInSeconds = 3600;

class AuthController {
  public async createJWT(req: Request, res: Response) {
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
  }
}

export default new AuthController();
