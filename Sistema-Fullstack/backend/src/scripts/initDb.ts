import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mariadb from "mariadb";
import { env } from "../config/env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const rootPool = mariadb.createPool({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    connectionLimit: 2
  });
  let conn;
  try {
    conn = await rootPool.getConnection();
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${env.db.database}\``);
    await conn.query(`USE \`${env.db.database}\``);

    const sqlPath = path.join(__dirname, "../../sql/schema.sql");
    const schemaSql = await fs.readFile(sqlPath, "utf8");
    for (const statement of schemaSql.split(";")) {
      if (statement.trim()) await conn.query(statement);
    }
    console.log("Base de datos inicializada");
  } finally {
    if (conn) conn.release();
    await rootPool.end();
  }
}

run().catch((error: Error) => {
  console.error("Error al inicializar DB:", error.message);
  process.exit(1);
});
