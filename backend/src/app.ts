import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import { router as apiRouter } from "./routes/index.js";
import { healthRouter } from "./routes/health.routes.js";
import { authRouter } from "./routes/auth.js";
import { usersRouter } from "./routes/users.routes.js";
import { projectsRouter } from "./routes/projects.routes.js";
import { tasksRouter } from "./routes/tasks.routes.js";
import { authenticateJwt } from "./middleware/auth.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/ping", (_req: Request, res: Response) => {
  res.status(200).send("pong");
});

app.use("/health", healthRouter);

app.use("/api/auth", authRouter);
app.use("/api", authenticateJwt);
app.use("/api/users", usersRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api", apiRouter);

// Error handler at the end
app.use(errorHandler);

export default app;
