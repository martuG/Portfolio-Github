import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env.js";
import { userRepository } from "../modules/users/user.repository.js";
import { AppError } from "../utils/AppError.js";
import { Role } from "../types/user.js";
import { canAccess, Permission } from "../config/roleMatrix.js";

export async function requireAuth(req: any, _res: any, next: any) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) throw new AppError("Token requerido", 401);

    const decoded = jwt.verify(token, env.jwt.secret) as JwtPayload;
    if (!decoded.sub) throw new AppError("Token invalido", 401);

    const user = await userRepository.findById(decoded.sub);
    if (!user) throw new AppError("Usuario no encontrado", 401);

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AppError) return next(error);
    next(new AppError("No autorizado", 401));
  }
}

export function requireRole(...roles: Role[]) {
  return (req: any, _res: any, next: any) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError("No tienes permisos para esta accion", 403));
    }
    next();
  };
}

export function requirePermission(permission: Permission) {
  return (req: any, _res: any, next: any) => {
    if (!canAccess(req.user?.role, permission)) {
      return next(new AppError("No tienes permisos para esta accion", 403));
    }
    next();
  };
}
