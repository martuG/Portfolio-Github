import { body, param, query } from "express-validator";

export const createTicketValidator = [
  body("title").trim().isLength({ min: 4 }).withMessage("Titulo invalido"),
  body("description")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Descripcion invalida"),
  body("priority")
    .isIn(["low", "medium", "high"])
    .withMessage("Prioridad invalida"),
  body("assigneeName")
    .optional({ nullable: true })
    .trim()
    .isLength({ min: 1 })
    .withMessage("Nombre de usuario invalido")
];

export const updateTicketValidator = [
  param("id").isInt({ min: 1 }).withMessage("ID invalido"),
  body("title").optional().trim().isLength({ min: 4 }),
  body("description").optional().trim().isLength({ min: 10 }),
  body("status").optional().isIn(["open", "in_progress", "closed"]),
  body("priority").optional().isIn(["low", "medium", "high"]),
  body("assigneeName")
    .optional({ nullable: true })
    .custom((value) => value === null || (typeof value === "string" && value.trim().length > 0))
    .withMessage("Nombre de usuario invalido")
];

export const idParamValidator = [param("id").isInt({ min: 1 }).withMessage("ID invalido")];

export const listTicketsValidator = [
  query("page").optional({ values: "falsy" }).isInt({ min: 1 }),
  query("limit").optional({ values: "falsy" }).isInt({ min: 1, max: 100 }),
  query("status").optional({ values: "falsy" }).isIn(["open", "in_progress", "closed"]),
  query("priority").optional({ values: "falsy" }).isIn(["low", "medium", "high"]),
  query("assigneeId").optional({ values: "falsy" }).isInt({ min: 1 }),
  query("search").optional({ values: "falsy" }).isLength({ min: 1 })
];
