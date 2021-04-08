/* eslint-disable @typescript-eslint/no-empty-function */
import { QueryResult } from "pg";
import pool from "./dbPool";

export default class DatabsePool {
  private static instance: DatabsePool;

  private constructor() {
    pool.connect((err) => {
      if (err) console.log("Error connecting to DB", err);
      else console.log("Connected to DB");
    });
  }

  public static getInstance(): DatabsePool {
    if (!DatabsePool.instance) {
      DatabsePool.instance = new DatabsePool();
    }
    return DatabsePool.instance;
  }

  public static query(text: string, values: any[]): Promise<QueryResult<any>> {
    console.log("query:", text, values);

    return pool.query(text, values);
  }
}
