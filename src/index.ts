import dotenv from "dotenv";
dotenv.config();
import express from "express";
import router from "./routes/index";
import { errorHandler } from "./errors/errorHandler";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server app running at port http://localhost:${port}`);
});
