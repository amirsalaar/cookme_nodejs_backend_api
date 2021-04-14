import { QueryResult } from "pg";

export default interface IBaseModel {
  findAll(): Promise<QueryResult<any>>;
}
