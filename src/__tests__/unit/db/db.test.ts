import { getDbInstance } from "../../../db/db";

describe("db", () => {
  it("should connect to db", async () => {
    const dbInstance = await getDbInstance();
    const res = await dbInstance.raw("select 1");
    await dbInstance.destroy();
    expect(res).toBeDefined();
  });
});
