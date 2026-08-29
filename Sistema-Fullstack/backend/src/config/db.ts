import mariadb from "mariadb";
import { env } from "./env.js";

export const pool = mariadb.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  connectionLimit: 10,
  acquireTimeout: 10000,
  bigIntAsNumber: true
});

export async function query<T = unknown[]>(sql: string, params: unknown[] = []): Promise<T> {
  let conn;
  try {
    conn = await pool.getConnection();
    return await conn.query(sql, params);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error de base de datos";
    throw new Error(`DB query failed: ${message}`);
  } finally {
    if (conn) conn.release();
  }
}

export async function testConnection(): Promise<void> {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query("SELECT 1");
  } finally {
    if (conn) conn.release();
  }
}

export async function closePool(): Promise<void> {
  await pool.end();
}
