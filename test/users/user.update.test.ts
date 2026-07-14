import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import supertest from "supertest";
import { app } from "../../src/index";
import { logger } from "../../src/config/logger";
import { UserHelper } from "../helpers/user-helper";

describe("PUT /api/v1/user/edit/:id", () => {
  let userId: string;
  let accessToken: string;
  let cashierToken: string;

  beforeAll(async () => {
    await UserHelper.create();
    const { token, tokenCashier } = await UserHelper.setupAdminAndCashier();

    userId = await UserHelper.userGetById();
    accessToken = token;
    cashierToken = tokenCashier;
  });

  afterAll(async () => {
    await UserHelper.deleteAdminTest();
    await UserHelper.deleteCashierTest();
    await UserHelper.delete();
  });

  it("should reject update user if no accessToken", async () => {
    const response = await supertest(app)
      .put(`/api/v1/user/edit/${userId}`)
      .send({
        username: "test update",
        email: "test@mail.com",
        password: "test123",
      });

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toContain("Unauthorized");
  });

  it("should reject update user if not admin", async () => {
    const response = await supertest(app)
      .put(`/api/v1/user/edit/${userId}`)
      .set("Authorization", `Bearer ${cashierToken}`)
      .send({
        username: "test update",
        email: "test@mail.com",
        password: "test123",
      });

    logger.debug(response.body);
    expect(response.status).toBe(403);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toContain(
      "Forbidden, you are not authorized to access this!",
    );
  });

  it("should reject update user if id not found", async () => {
    const response = await supertest(app)
      .put("/api/v1/user/edit/invalid-id")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        username: "test update",
        email: "test@mail.com",
        password: "test123",
      });

    logger.debug(response.body);
    expect(response.status).toBe(404);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toContain("Data not found!");
  });

  it("should update user if request is valid", async () => {
    const response = await supertest(app)
      .put(`/api/v1/user/edit/${userId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        username: "test update",
        email: "test@mail.com",
        password: "test123",
      });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.data.username).toBe("test update");
    expect(response.body.data.email).toBe("test@mail.com");
  });
});
