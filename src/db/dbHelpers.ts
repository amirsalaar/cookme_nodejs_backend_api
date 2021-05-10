import { Knex } from "knex";
import { getDbInstance } from "./db";

export const setupTestDatabase = async (): Promise<Knex<any, unknown[]>> => {
  const dbInstance = await getDbInstance();
  try {
    await dbInstance.migrate.rollback();
    await dbInstance.migrate.latest();
    return dbInstance;
  } catch (error) {
    console.log("Error in setting up the database:", error);
    process.exit(1);
  }
};

export const resetTestDatabase = async (): Promise<void> => {
  const dbInstance = await getDbInstance();
  try {
    await dbInstance.migrate.rollback();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
