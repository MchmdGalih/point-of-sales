import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/index";
import { errorHandler } from "./errors/errorHandler";
import { requestlogger } from "./middleware/loggerMiddleware";
import { logger } from "./config/logger";

export const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.use("/api/v1", router);
app.use(requestlogger);

app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});
