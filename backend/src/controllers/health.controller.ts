import { Request, Response } from "express";
import { verifyDatabaseConnection } from "../config/database.js";

export async function healthcheck(_req: Request, res: Response): Promise<void> {
  await verifyDatabaseConnection();
  res.json({ status: "ok" });
}



