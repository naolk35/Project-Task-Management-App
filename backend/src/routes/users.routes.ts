import { Router } from "express";
import { authenticateJwt } from "../middleware/auth.js";
import { authorizeRole } from "../middleware/authorize.js";
import {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/users.controller.js";

export const usersRouter = Router();

usersRouter.use(authenticateJwt, authorizeRole(["admin"]));

usersRouter.get("/", listUsers);
usersRouter.get("/:id", getUser);
usersRouter.post("/", createUser);
usersRouter.put("/:id", updateUser);
usersRouter.delete("/:id", deleteUser);
