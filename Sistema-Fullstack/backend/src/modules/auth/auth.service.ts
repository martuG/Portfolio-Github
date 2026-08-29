import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { userRepository } from "../users/user.repository.js";
import { AppError } from "../../utils/AppError.js";
import { User } from "../../types/user.js";

function signToken(user: User) {
  return jwt.sign({ role: user.role }, env.jwt.secret, {
    subject: String(user.id),
    expiresIn: env.jwt.expiresIn
  });
}

export const authService = {
  async register({ name, email, password }: { name: string; email: string; password: string }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) throw new AppError("El email ya existe", 409);

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await userRepository.create({ name, email, passwordHash, role: "user" });

    const user = await userRepository.findById(result.insertId);
    return { user, token: signToken(user) };
  },

  async login({ email, password }: { email: string; password: string }) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new AppError("Credenciales invalidas", 401);

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) throw new AppError("Credenciales invalidas", 401);

    const safeUser = await userRepository.findById(user.id);
    return { user: safeUser, token: signToken(safeUser) };
  }
};
