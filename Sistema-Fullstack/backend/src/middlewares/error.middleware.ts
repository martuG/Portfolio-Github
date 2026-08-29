import { env } from "../config/env.js";

export function errorMiddleware(err: any, _req: any, res: any, _next: any) {
  const status = err.statusCode || 500;
  const payload: Record<string, unknown> = {
    ok: false,
    message: err.message || "Error interno del servidor"
  };

  if (err.details) {
    payload.details = err.details;
  }

  if (env.nodeEnv !== "production") {
    payload.stack = err.stack;
  }

  res.status(status).json(payload);
}
