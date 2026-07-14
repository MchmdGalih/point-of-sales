import bcrypt from "bcrypt";
import { prisma } from "../../src/lib/prisma";
import { BaseHelper } from "./base-helper";
export class UserHelper extends BaseHelper {
  static async create() {
    await prisma.user.create({
      data: {
        username: "test",
        email: "test@mail.com",
        password: await bcrypt.hash("test123", 10),
        role: "CASHIER",
      },
    });
  }

  static async userGetById() {
    const user = await prisma.user.findUnique({
      where: {
        username: "test",
      },
    });

    return user!.id;
  }
}
