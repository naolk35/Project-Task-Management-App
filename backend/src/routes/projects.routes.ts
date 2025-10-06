import { Router } from "express";
import { authenticateJwt } from "../middleware/auth.js";
import { authorizeRole } from "../middleware/authorize.js";
import {
  listProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projects.controller.js";

export const projectsRouter = Router();

projectsRouter.use(authenticateJwt);

projectsRouter.get("/", listProjects);
projectsRouter.post("/", authorizeRole(["admin", "manager"]), createProject);
projectsRouter.put("/:id", authorizeRole(["admin", "manager"]), updateProject);
projectsRouter.delete(
  "/:id",
  authorizeRole(["admin", "manager"]),
  deleteProject
);
