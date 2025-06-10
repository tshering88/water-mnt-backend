import { body, param, ValidationChain, validationResult } from "express-validator";
import User from "../models/userModels";  // Adjust import path if needed
import { UserRole } from "./constant";    // Adjust import path
import { Request, Response, NextFunction } from "express";  // Import proper types
import mongoose from "mongoose";


export const isValidObjectId = (id: string, res: Response): boolean => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid user ID format" });
    return false;
  }
  return true;
};

export const validate = (validations: ValidationChain[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(422).json({ errors: errors.array() });
  };
};

// Signup validator
export const userSignupValidator: ValidationChain[] = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

  body("phone")
    .trim()
    .matches(/^\+?975?(1[6-9]|7[1-7])\d{6}$/)  // Bhutan phone number format (+977 optional, 8-10 digits)
    .withMessage("Valid Bhutan phone number is required"),

  body("cid")
    .trim()
    .isLength({ min: 11, max: 11 })  // assuming CID is 11 chars (adjust if needed)
    .withMessage("CID must be exactly 11 characters")
    .custom(async (cid: string) => {
      const user = await User.findOne({ cid });
      if (user) {
        throw new Error("CID already in use");
      }
      return true;
    }),

  body("role")
    .optional()
    .isIn(Object.values(UserRole))
    .withMessage(`Role must be one of: ${Object.values(UserRole).join(", ")}`),

  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

// Login validator (assuming login by phone or cid)
export const userLoginValidator: ValidationChain[] = [
  body("identifier")
  .trim()
  .notEmpty()
  .withMessage("Phone or CID is required")
  .custom((value) => {
    const isPhone = /^\+?975?(1[6-9]|7[1-7])\d{6}$/.test(value);
    const isCid = /^\d{11}$/.test(value);
    if (!isPhone && !isCid) {
      throw new Error("Must be a valid Bhutan phone number or CID");
    }
    return true;
  }),

];


// Update user validator (partial updates allowed)
export const userUpdateValidator: ValidationChain[] = [
  param("id")
    .isMongoId()
    .withMessage("Invalid user ID"),

  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty"),

  body("phone")
    .optional()
    .trim()
    .matches(/^\+?977\d{8,10}$/)
    .withMessage("Valid Bhutan phone number is required"),

  body("cid")
    .optional()
    .trim()
    .isLength({ min: 11, max: 11 })
    .withMessage("CID must be exactly 11 characters")
    .custom(async (cid: string, { req }) => {
  const user = await User.findOne({ cid });
  if (user && req.params?.id && user._id.toString() !== req.params.id) {
    throw new Error("CID already in use");
  }
  return true;
}),


  body("role")
    .optional()
    .isIn(Object.values(UserRole))
    .withMessage(`Role must be one of: ${Object.values(UserRole).join(", ")}`),

  body("password")
    .optional()
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];
