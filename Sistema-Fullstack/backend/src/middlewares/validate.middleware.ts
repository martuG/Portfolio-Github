import { validationResult } from "express-validator";
import { AppError } from "../utils/AppError.js";

export function validateRequest(req: any, _res: any, next: any) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Datos de entrada invalidos", 422, errors.array()));
  }
  next();
}
