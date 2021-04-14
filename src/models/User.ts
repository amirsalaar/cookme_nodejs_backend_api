import BaseModelImp from "./BaseModelImp";

export default class User extends BaseModelImp {
  constructor() {
    super();
    this.tableName = "users";
  }
}
