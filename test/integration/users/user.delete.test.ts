import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import supertest from "supertest";
import { app } from "../../../src/index";
import { UserHelper } from "../../helpers/user-helper";

describe("DELETE api/v1/user/:id", () => {
  let userId: string;
  let accessToken: string;
  let cashierToken: string;

  beforeAll(async () => {
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

  it("should reject delete user if no accessToken", async () => {
    const response = await supertest(app).delete(
      `/api/v1/user/delete/${userId}`,
    );
    expect(response.status).toBe(401);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe("Unauthorized");
  });

  it("should reject delete user if no admin", async () => {
    const response = await supertest(app)
      .delete(`/api/v1/user/delete/${userId}`)
      .set("Authorization", `Bearer ${cashierToken}`);

    expect(response.status).toBe(403);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toContain(
      "Forbidden, you are not authorized to access this!",
    );
  });

  it("should reject delete if user not found", async () => {
    const response = await supertest(app)
      .delete("/api/v1/user/delete/invalid-id")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(404);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toContain("User not found");
  });

  it("should delete user if request is valid", async () => {
    const response = await supertest(app)
      .delete(`/api/v1/user/delete/${userId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toContain("User deleted successfully");
  });
});
