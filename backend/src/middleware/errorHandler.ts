import { Request, Response, NextFunction } from "express";

// Generic error handler to centralize error responses
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const isKnown =
    typeof err === "object" && err !== null && "status" in (err as any);
  const status = isKnown ? ((err as any).status as number) : 500;
  const message = isKnown
    ? ((err as any).message as string)
    : "Internal Server Error";
  res.status(status).json({ message });
}
