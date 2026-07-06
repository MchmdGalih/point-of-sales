import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

export const validate =
  (schema: ZodSchema, source: "body" | "params" | "query" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return res.status(400).json({
        message: "Validation Error",
        errors: result.error.issues.map((err: any) => ({
          field: err.path?.[0],
          message: err.message,
        })),
      });
    }

    if (source === "body") req.body = result.data;
    if (source === "params") req.params = result.data as Record<string, string>;
    if (source === "query") res.locals.query = result.data;
    next();
  };
