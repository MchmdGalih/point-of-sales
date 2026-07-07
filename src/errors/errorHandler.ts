import { Prisma } from "../../generated/prisma/client";
import { CustomError } from "./customError";
import { handlePrismaError } from "./prismaError";

export const errorHandler = (err: any, req: any, res: any, next: any) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const mapped = handlePrismaError(err);
    return res.status(mapped.statusCode).json({
      status: mapped.status,
      message: mapped.message,
    });
  }

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      status: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    status: false,
    message: "Something went wrong",
  });
};
