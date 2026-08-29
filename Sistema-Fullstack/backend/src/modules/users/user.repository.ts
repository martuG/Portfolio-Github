import { query } from "../../config/db.js";
import { InsertResult } from "../../types/db.js";

export const userRepository = {
  findByEmail(email: string) {
    return query(
      "SELECT id, name, email, password_hash, role, created_at FROM users WHERE email = ? LIMIT 1",
      [email]
    ).then((rows: any) => rows[0]);
  },
  findById(id: number | string) {
    return query(
      "SELECT id, name, email, role, created_at FROM users WHERE id = ? LIMIT 1",
      [id]
    ).then((rows: any) => rows[0]);
  },
  findByName(name: string) {
    return query(
      "SELECT id, name, email, role, created_at FROM users WHERE name = ? LIMIT 1",
      [name]
    ).then((rows: any) => rows[0]);
  },
  findAgents() {
    return query(
      "SELECT id, name, email, role, created_at FROM users WHERE role = 'agent' ORDER BY name ASC"
    );
  },
  create({ name, email, passwordHash, role }: any) {
    return query<InsertResult>(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
      [name, email, passwordHash, role]
    );
  }
};
