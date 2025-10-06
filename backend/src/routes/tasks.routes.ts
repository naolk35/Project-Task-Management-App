import { Router } from "express";
import { authenticateJwt } from "../middleware/auth.js";
import { authorizeRole } from "../middleware/authorize.js";
import {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/tasks.controller.js";

export const tasksRouter = Router();

tasksRouter.use(authenticateJwt);

tasksRouter.get("/", listTasks);
tasksRouter.get("/:id", getTask);
tasksRouter.post("/", authorizeRole(["admin", "manager"]), createTask);
tasksRouter.put(
  "/:id",
  authorizeRole(["admin", "manager", "employee"]),
  updateTask
);
tasksRouter.delete("/:id", authorizeRole(["admin", "manager"]), deleteTask);
