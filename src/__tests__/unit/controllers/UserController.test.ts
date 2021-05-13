import { Knex } from "knex";
import Sinon from "sinon";
import request from "supertest";
import { resetTestDatabase, setupTestDatabase } from "../../../db/dbHelpers";
import app from "../../../app";
import { UserService } from "../../../services/UserService";
import { UserRepository } from "../../../models";

describe("GET /api/v1/users/:id", () => {
  let dbInstance: Knex<any, unknown[]>;

  beforeEach(async () => {
    dbInstance = await setupTestDatabase();
  });
  afterEach(async () => await resetTestDatabase());
  afterAll(async () => await dbInstance.destroy());
  it("sends the correct response when a user with the id is found", async () => {
    const fakeData = { id: "123", username: "abc", email: "abc@gmail.com" };
    const stub = Sinon.stub(UserRepository.prototype, "getUserById").resolves(
      fakeData,
    );

    await request(app.run())
      .get("/api/v1/users/123")
      .expect(200)
      .expect("Content-Type", /json/)
      .expect(fakeData);

    stub.restore();
  });

  it("sends the correct response when there is an error", async () => {
    const fakeError = { message: "Something went wrong" };
    const stub = Sinon.stub(UserService.prototype, "getUserById").throws(
      fakeError,
    );

    await request(app.run())
      .get("/api/v1/users/321")
      .expect(500)
      .expect("Content-Type", /json/)
      .expect({ error: fakeError.message });

    stub.restore();
  });

  it("it returns the correct status code if cannot find the user", async () => {
    const stub = Sinon.stub(UserRepository.prototype, "getUserById").resolves(
      null,
    );
    await request(app.run()).get("/api/v1/users/999").expect(404);
    stub.restore();
  });
});
