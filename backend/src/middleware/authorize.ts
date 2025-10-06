import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth.js";

export function authorizeRole(
  allowed: Array<"admin" | "manager" | "employee">
) {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    const role = req.user?.role;
    if (!role || !allowed.includes(role as never)) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    next();
  };
}
