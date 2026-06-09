import { Prisma } from "../../generated/prisma/client";

export const handlePrismaError = (
  err: Prisma.PrismaClientKnownRequestError,
) => {
  switch (err.code) {
    case "P2002":
      return {
        statusCode: 409,
        status: false,
        message: "Unique constraint failed on the field",
      };
    case "P2003":
      return {
        statusCode: 400,
        status: false,
        message: "Foreign key constraint failed on the field",
      };
    case "P2025": {
      return {
        statusCode: 404,
        status: false,
        message: "Data not found",
      };
    }
    default:
      return {
        statusCode: 500,
        status: false,
        message: "Database error!",
      };
  }
};
