import { body } from "express-validator";

export const registerValidator = [
  body("name").trim().isLength({ min: 2 }).withMessage("Nombre invalido"),
  body("email").isEmail().withMessage("Email invalido"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password debe tener al menos 6 caracteres")
];

export const loginValidator = [
  body("email").isEmail().withMessage("Email invalido"),
  body("password").notEmpty().withMessage("Password requerido")
];
