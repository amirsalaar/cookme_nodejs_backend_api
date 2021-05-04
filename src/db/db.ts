import "../../dotenvConfig";
import knex, { Knex } from "knex";

const masterConfig: Knex.Config = {
  client: "pg",
  connection: {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB_MASTER,
    port: parseInt(process.env.POSTGRES_PORT!),
  },
};

export const mainConfig: Knex.Config = {
  client: "pg",
  connection: {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB_NAME,
    port: parseInt(process.env.POSTGRES_PORT!),
  },
  migrations: {
    // This is missing from the TypeScript types currently.
    stub: "migration.stub",
    directory: "./src/db/migrations",
  },
};

export const dbClient: Knex = knex(masterConfig);

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

const mainInstance: Knex = knex(mainConfig);

console.log(
  `*** Will connect to:
    - Master db connection: postgres://${process.env.POSTGRES_USER}@${process.env.POSTGRES_HOST}/${process.env.POSTGRES_DB_MASTER}
    - Target db connection: postgres://${process.env.POSTGRES_USER}@${process.env.POSTGRES_HOST}/${process.env.POSTGRES_DB_NAME}`,
);

export const getDbInstance = async (): Promise<Knex<any, unknown[]>> => {
  try {
    await dbClient.raw(
      `SELECT 'CREATE DATABASE ${process.env.POSTGRES_DB_NAME}' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${process.env.POSTGRES_DB_NAME}') `,
    );
    return mainInstance;
  } catch (error) {
    console.log(`Failed to return db instance ${error}`);
    process.exit(1);
  }
};

export const timestamp = (): string => new Date().toUTCString();
