/**
 * Validates JWT to see if there is a valid token on the request header
 */
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = <string>req.header("Authorization");
    if (!authHeader)
      throw new Error(
        "Authorization header was not found on the request object",
      );
    const jwtSecretKey = process.env.JWT_SECRET;
    if (!jwtSecretKey)
      throw new Error(
        "JWT Secret Key was not found int he environment variables",
      );

    const token = authHeader.replace("Bearer ", "");
    const jwtPayload = <any>jwt.verify(token, jwtSecretKey);
    res.locals.jwtPayload = jwtPayload;

    /**
     * The token is valid for 1 hr
     * Send a new token on every request
     */
    const { userId, username } = jwtPayload;
    const newToken = jwt.sign({ userId, username }, jwtSecretKey, {
      expiresIn: "1h",
    });

    res.setHeader("token", newToken);
    next();
  } catch (error) {
    res.json({
      error: `Authentication failed. Please try logging in. ${error.message}`,
    });
  }
};

export default auth;
