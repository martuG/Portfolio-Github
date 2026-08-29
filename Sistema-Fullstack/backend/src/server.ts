import app from "./app.js";
import { env } from "./config/env.js";
import { closePool, testConnection } from "./config/db.js";

async function start() {
  try {
    await testConnection();
    // eslint-disable-next-line no-console
    console.log("Conexion a base de datos OK");

    app.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Backend corriendo en http://localhost:${env.port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("No se pudo iniciar el servidor:", error);
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  await closePool();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await closePool();
  process.exit(0);
});

start();
