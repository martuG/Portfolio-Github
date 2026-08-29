import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || "development",
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "ticketing_db"
  },
  jwt: {
    secret: process.env.JWT_SECRET || "change_me",
    expiresIn: process.env.JWT_EXPIRES_IN || "8h"
  }
};

if (env.nodeEnv === "production" && env.jwt.secret === "change_me") {
  throw new Error("JWT_SECRET debe configurarse en produccion");
}
