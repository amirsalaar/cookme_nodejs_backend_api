import { Knex } from "knex";
import { User } from "src/types/User";
import { getDbInstance } from "../db/db";

export class UserRepository {
  private dbInstancePromise: Promise<Knex<any, unknown[]>>;
  private tableName: string;

  constructor() {
    this.tableName = "users";
    this.dbInstancePromise = getDbInstance();
  }

  /**
   * async getUserById
   */
  public async getUserById(id: number): Promise<User> {
    try {
      const query = `SELECT * FROM "users" u WHERE u.id = ${id}`;
      const result = await (await this.dbInstancePromise).raw(query);
      return result ? result.rows[0] : null;
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }
}
