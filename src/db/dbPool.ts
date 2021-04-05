import { Pool, PoolConfig } from "pg";
import { URL } from "url";

let config: PoolConfig | undefined;

/**
 * For "development" environment we know the databse
 * information
 */
if (process.env.NODE_ENV === "development") {
  config = {
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: 10,
    idleTimeoutMillis: 1000,
  };
}

/**
 * Setting up the config object based on the DB URL
 * which is going to be available on production sites
 */
if (process.env.NODE_ENV === "production") {
  const params = new URL(process.env.DB_URL!);
  try {
    config = {
      user: params.username,
      password: params.password,
      host: params.hostname,
      port: parseInt(params.port),
      database: params.pathname.split("/")[1],
      ssl: true,
    };
  } catch (error) {
    console.log(error.message);
  }
}

const pool = new Pool(config);

export default pool;
