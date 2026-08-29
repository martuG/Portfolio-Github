import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./modules/auth/auth.routes.js";
import ticketRoutes from "./modules/tickets/ticket.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { requireAuth } from "./middlewares/auth.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => res.json({ ok: true, message: "API UP" }));
app.use("/api/auth", authRoutes);
app.use("/api/tickets", requireAuth, ticketRoutes);
app.use("/api/dashboard", requireAuth, dashboardRoutes);
app.use("/api/users", requireAuth, userRoutes);

app.use(errorMiddleware);

export default app;
