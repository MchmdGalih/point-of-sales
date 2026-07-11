import { describe, expect, test } from "@jest/globals";
import supertest from "supertest";
import { app } from "../src/index";
import { logger } from "../src/config/logger";

describe("POST /api/v1/user", () => {
  test("shoud reject register new user if request is invalid", async () => {
    const response = await supertest(app).post("/api/v1/user").send({
      username: "",
      email: "",
      password: "",
    });

    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });
});
