import { Knex } from "knex";
import Sinon from "sinon";
import request from "supertest";
import { resetTestDatabase, setupTestDatabase } from "../../../db/dbHelpers";
import app from "../../../app";
import { UserService } from "../../../services/UserService";
import auth from "../../../middlewares/Auth";
import jwt from "jsonwebtoken";

describe("GET /api/v1/users/:id -- getUserById", () => {
  let dbInstance: Knex<any, unknown[]>;
  let stubAuth: Sinon.SinonStub;

  beforeEach(async () => {
    dbInstance = await setupTestDatabase();
    stubAuth = Sinon.stub({ auth }, "auth").callsFake(async (req, res, next) =>
      next(),
    );
  });
  afterEach(async () => {
    await resetTestDatabase();
    stubAuth.restore();
  });
  afterAll(async () => await dbInstance.destroy());
  it("sends the correct response when a user with the id is found", async () => {
    const fakeData = { id: "123", username: "abc", email: "abc@gmail.com" };
    const stub = Sinon.stub(UserService.prototype, "getUserById").resolves(
      fakeData,
    );

    await request(app.run())
      .get("/api/v1/users/123")
      .set("Authorization", "Bearer " + jwt.sign({}, process.env.JWT_SECRET))
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
      .set("Authorization", "Bearer " + jwt.sign({}, process.env.JWT_SECRET))
      .expect(500)
      .expect("Content-Type", /json/)
      .expect({ error: fakeError.message });

    stub.restore();
  });

  it("returns the correct status code if cannot find the user", async () => {
    const stub = Sinon.stub(UserService.prototype, "getUserById").resolves(
      null,
    );
    await request(app.run())
      .get("/api/v1/users/999")
      .set("Authorization", "Bearer " + jwt.sign({}, process.env.JWT_SECRET))
      .expect(404);
    stub.restore();
  });
});
