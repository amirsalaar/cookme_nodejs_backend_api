import { User } from "src/types/User";
import { getDbInstance } from "../db/db";

export const getUserById = async (id: number): Promise<User> => {
  try {
    const dbInstance = await getDbInstance();
    const query = `SELECT * FROM "users" u WHERE u.id = ${id}`;
    const result = await dbInstance.raw(query);
    return result ? result.rows[0] : null;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
