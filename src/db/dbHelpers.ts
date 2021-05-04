import { dbClient } from "./db";

export const resetDatabase = async (): Promise<void> => {
  try {
    await dbClient.raw(
      `DROP DATABASE IF EXISTS ${process.env.POSTGRES_DB_NAME}`,
    );
    await dbClient.raw(`CREATE DATABASE ${process.env.POSTGRES_DB_NAME}`);
    await dbClient.destroy();
  } catch (error) {
    console.log(`Failed to reset database ${error}`);
  }
};
