/* eslint-disable @typescript-eslint/no-empty-function */
import { QueryResult } from "pg";
import pool from "./dbPool";

export default class DatabsePool {
  private static instance: DatabsePool;

  private constructor() {
    pool.connect((err) => {
      try {
        if (err) throw err;
        else console.log("Connected to DB");
      } catch (err) {
        console.log(err.message);
      }
    });
  }

  public static getInstance(): DatabsePool {
    if (!DatabsePool.instance) {
      DatabsePool.instance = new DatabsePool();
    }
    return DatabsePool.instance;
  }

  public static async query(
    text: string,
    values?: any[],
  ): Promise<QueryResult<any>> {
    console.log("query:", text, values);

    try {
      return await pool.query(text, values);
    } catch (error) {
      throw error;
    }
  }
}
