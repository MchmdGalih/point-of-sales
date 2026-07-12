import { describe, expect, it, test } from "@jest/globals";
import supertest from "supertest";
import { app } from "../src/index";
import { logger } from "../src/config/logger";

describe("POST/api/v1/user/create", () => {
  it("should reject register now user if request in valid", async () => {
    const response = await supertest(app).post("/api/v1/user/create").send({
      username: "",
      email: "",
      password: "",
    });

    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("should register new user if request is valid", async () => {
    const response = await supertest(app).post("/api/v1/user/create").send({
      username: "user test 1",
      email: "usertest01@mailcom",
      password: "usertest123",
    });

    logger.debug(response.body);
    expect(response.status).toBe(201);
    expect(response.body.data.username).toBe("user test 1");
    expect(response.body.data.email).toBe("usertest01@mailcom");
  });
});
