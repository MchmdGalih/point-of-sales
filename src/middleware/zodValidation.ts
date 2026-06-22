import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation Error",
        errors: result.error.issues.map((err: any) => ({
          field: err.path?.[0],
          message: err.message,
        })),
      });
    }

    req.body = result.data;
    next();
  };
