import { IUser } from "../types";
import { User } from "../models";
import { getDbInstance } from "../db/db";
import { Knex } from "knex";
import bcrypt from "bcrypt";
export class UserService {
  private dbInstancePromise: Promise<Knex<any, unknown[]>>;

  constructor() {
    this.dbInstancePromise = getDbInstance();
  }

  /**
   * getUserById
   * @param id {number}
   */
  public async getUserById(id: number): Promise<IUser | null> {
    try {
      const query = `SELECT * FROM "users" u WHERE u.id = ${id}`;
      const result = await (await this.dbInstancePromise).raw(query);

      return result.rowCount !== 0
        ? this.castDbResultOnUser(result.rows[0])
        : null;
    } catch (error) {
      throw new Error(
        `Database thrown error when querying the user with id: ${id} -- ${error.message}`,
      );
    }
  }

  /**
   * getUserByUsername
   * @param username
   */
  public async getUserByUsername(username: string): Promise<User> {
    try {
      const query = `SELECT * FROM "users" u WHERE u.username = ${username}`;
      const result = await (await this.dbInstancePromise).raw(query);
      return result.rowCount !== 0 ? result.rows[0] : null;
    } catch (error) {
      throw new Error(
        `Error thrown when querying user with username: ${username} -- ${error.message}`,
      );
    }
  }

  /**
   * createAUser
   */
  public async createAUser(aUser: IUser) {
    try {
      const { username, password, email, firstName, lastName } = aUser;
      if (!password || !email)
        throw new Error("Email/Password cannot be empty!");

      const user = new User(username, password, email);

      const passwordDigest = bcrypt.hashSync(password, 16);

      const query = `INSERT INTO "users"
        ("username", "password", "email", "first_name", "last_name")
        VALUES (${username},${passwordDigest},${email},${firstName},${lastName});`;

      const result = await (await this.dbInstancePromise).raw(query);
    } catch (error) {
      throw new Error(
        `Error thrown when inserting a new user - ${error.message}`,
      );
    }
  }

  /**
   * castDbResultOnUser
   */
  public castDbResultOnUser(dbResult: { [key in string]: any }): IUser {
    const user = new User();

    user.id = parseInt(dbResult.id);
    user.username = dbResult.username;
    user.firstName = dbResult.first_name;
    user.lastName = dbResult.last_name;
    user.email = dbResult.email;
    user.passwordDigest = dbResult.password_digest;
    user.address = dbResult.address;
    user.role = dbResult.role;
    user.phoneNumber = dbResult.phone_number;
    user.updatedAt = dbResult.updated_at;
    user.createdAt = dbResult.created_at;

    return user;
  }
}
