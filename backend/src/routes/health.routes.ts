import { Router } from "express";
import { healthcheck } from "../controllers/health.controller.js";

export const healthRouter = Router();

healthRouter.get("/", healthcheck);



