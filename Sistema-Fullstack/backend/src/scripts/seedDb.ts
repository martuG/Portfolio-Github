import bcrypt from "bcryptjs";
import { query } from "../config/db.js";

async function run() {
  await query("DELETE FROM tickets");
  await query("DELETE FROM users");

  const passwordHash = await bcrypt.hash("123456", 10);
  await query(
    "INSERT INTO users (id, name, email, password_hash, role) VALUES (1, 'Admin Demo', 'admin@demo.com', ?, 'admin')",
    [passwordHash]
  );
  await query(
    "INSERT INTO users (id, name, email, password_hash, role) VALUES (2, 'Agente Demo', 'agente@demo.com', ?, 'agent')",
    [passwordHash]
  );
  await query(
    "INSERT INTO users (id, name, email, password_hash, role) VALUES (3, 'Usuario Demo', 'usuario@demo.com', ?, 'user')",
    [passwordHash]
  );

  await query(
    `INSERT INTO tickets (title, description, status, priority, reporter_id, assignee_id)
     VALUES
     ('Error en login', 'El sistema no permite iniciar sesion desde Firefox', 'open', 'high', 3, 2),
     ('Actualizar FAQ', 'Agregar preguntas frecuentes del nuevo modulo de pagos', 'in_progress', 'medium', 1, 2),
     ('Reporte mensual', 'Generar reporte mensual de tickets cerrados', 'closed', 'low', 1, 2),
     ('Mejora de UI', 'Ajustar espaciados en el dashboard principal', 'open', 'medium', 3, NULL)`
  );

  console.log("Datos de prueba insertados");
}

run().catch((error: Error) => {
  console.error("Error al insertar seed:", error.message);
  process.exit(1);
});
