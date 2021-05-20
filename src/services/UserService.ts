import { IUser } from "src/types/User";
import { User } from "../models";
import { getDbInstance } from "../db/db";
import { Knex } from "knex";

export class UserService {
  private dbInstancePromise: Promise<Knex<any, unknown[]>>;

  constructor() {
    this.dbInstancePromise = getDbInstance();
  }

  // /**
  //  * getUsers
  //  */
  // public async getUsers(): Promise<User[]> {
  //   try {
  //     const users = await this.userRepo.findAll();
  //     return users.rows;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

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
