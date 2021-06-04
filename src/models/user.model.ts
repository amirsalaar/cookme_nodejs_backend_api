import jwt from "jsonwebtoken";
import validator from "validator";
import { IUser } from "src/types/user.types";
import { BaseModel } from "./base.model";

export class User extends BaseModel implements IUser {
  public username: string;
  public firstName: string;
  public lastName: string;
  public email: string;
  public password: string;
  public passwordDigest: string;
  public role: number;
  public address: string | null;
  public phoneNumber: string | null;

  constructor(username?: string, password?: string, email?: string) {
    super();
    if (username) {
      this.username = username;
      this.validateUsername();
    }
    if (password) {
      this.password = password;
      this.validatePassword();
    }
    if (email) {
      this.email = email;
      this.validateEmail();
    }
  }

  /**
   * validateEntity
   */
  private validateEmail(): void {
    if (!validator.isEmail(this.email)) {
      throw new Error("Invalid email address");
    }
  }

  private validatePassword(): void {
    if (!validator.isStrongPassword(this.password)) {
      throw new Error("Poor password chosen");
    }
  }

  private validateUsername() {
    if (!validator.isLength(this.username, { min: 4 })) {
      throw new Error("Username must be at least 4 letters");
    }
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
