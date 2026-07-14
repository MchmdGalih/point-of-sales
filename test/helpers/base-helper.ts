import { prisma } from "../../src/lib/prisma";
import bcrypt from "bcrypt";
import supertest from "supertest";
import { app } from "../../src/index";

export class BaseHelper {
  static async createAdmin() {
    await prisma.user.create({
      data: {
        username: "test admin",
        email: "testadmin1@mail.com",
        password: await bcrypt.hash("testadmin123", 10),
        role: "ADMIN",
      },
    });
  }

  static async createCashier() {
    await prisma.user.create({
      data: {
        username: "test cashier",
        email: "testcashier1@mail.com",
        password: await bcrypt.hash("testcashier123", 10),
        role: "CASHIER",
      },
    });
  }

  static async loginAdmin() {
    const response = await supertest(app).post("/api/v1/auth/login").send({
      email: "testadmin1@mail.com",
      password: "testadmin123",
    });
    return response.body.data.accessToken;
  }

  static async loginCashier() {
    const response = await supertest(app).post("/api/v1/auth/login").send({
      email: "testcashier1@mail.com",
      password: "testcashier123",
    });
    return response.body.data.accessToken;
  }

  static async deleteAdminTest() {
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: "testadmin1@mail.com",
        },
      },
    });
  }

  static async deleteCashierTest() {
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: "testcashier1@mail.com",
        },
      },
    });
  }

  static async setupAdminAndCashier() {
    await this.deleteAdminTest();
    await this.deleteCashierTest();
    await this.createAdmin();
    await this.createCashier();

    return {
      token: await this.loginAdmin(),
      tokenCashier: await this.loginCashier(),
    };
  }

  static async delete() {
    await prisma.user.deleteMany({
      where: {
        username: {
          contains: "test",
        },
      },
    });
  }
}
