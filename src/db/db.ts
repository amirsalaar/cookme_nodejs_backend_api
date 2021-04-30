import "../../dotenvConfig";
import knex, { Knex } from "knex";

export const config: Knex.Config = {
  client: "pg",
  connection: {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    port: parseInt(process.env.POSTGRES_PORT!),
  },
  migrations: {
    // This is missing from the TypeScript types currently.
    stub: "migration.stub",
    directory: "./src/db/migrations",
  },
};

const instance: Knex = knex(config as Knex.Config);

console.log(
  `Will connect to postgres://${process.env.POSTGRES_USER}@${process.env.POSTGRES_HOST}/${process.env.POSTGRES_DB}`,
);

instance
  .raw("select 1")
  .then(() => {
    console.log("Successfully connected to database");
  })
  .catch((err) => {
    console.log(`Failed to connect to database: ${err}`);
    process.exit(1);
  });

export const db = async (): Promise<Knex<any, unknown[]>> => instance;

export const timestamp = (): string => new Date().toUTCString();
