import { QueryResult } from "pg";
import DatabsePool from "../db/DbClient";
import IBaseModel from "./IBaseModel";

export default abstract class BaseModelImp implements IBaseModel {
  protected tableName: string;

  /**
   * findAll
   */
  public async findAll(): Promise<QueryResult<any>> {
    return DatabsePool.query(`SELECT * FROM ${this.tableName}`);
  }
}
