import { Knex } from "knex";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { IUser } from "src/types/User";
import { BaseModel } from "./BaseModel";

export class User extends BaseModel implements IUser {
  public username: string;
  public firstName: string;
  public lastName: string;
  public email: string;
  public passwordDigest: string;
  public role: number;
  public address: string | null;
  public phoneNumber: string | null;

  constructor() {
    super();
  }

  /**
   * checkIfUnencryptedPasswordIsValid
   * @param unencryptedPassword
   */
  public checkIfUnencryptedPasswordIsValid(
    unencryptedPassword: string,
  ): boolean {
    return true;
  }

  /**
   * generateAuthToken
   */
  public generateAuthToken(user: IUser): string {
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SSECRET!,
      { expiresIn: "1h" },
    );

    return token;
  }
}
