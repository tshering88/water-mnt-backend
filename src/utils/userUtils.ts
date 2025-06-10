import mongoose from "mongoose";
import { Response } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import { CustomJwtPayload, IUser } from "../types/authTypes";
import { UserRole } from "./constant";

// Reusable error handler
export const handleError = (res: Response, error: unknown, statusCode = 400): void => {
  const errorMessage = error instanceof Error ? error.message : "Server error";
  res.status(statusCode).json({ message: errorMessage });
};

// Validate MongoDB ObjectID
export const isValidObjectId = (id: string, res: Response): boolean => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid user ID format" });
    return false;
  }
  return true;
};

// JWT Config
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ;

// Token generation
export const generateToken = (payload: CustomJwtPayload): string => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as SignOptions);
};

// Token verification
export const verifyToken = (token: string): CustomJwtPayload => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.verify(token, JWT_SECRET) as CustomJwtPayload;
};

export const sanitizeUser = (user: any) => {
    const userObj = user.toObject?.() ?? user;
    const { password, __v, ...safe } = userObj;
    return safe;
}

export const getUserPermissions = async (user: IUser): Promise<string[]> => {
  const roleMap: Record<UserRole, string[]> = {
    [UserRole.SUPER_ADMIN]: [
      UserRole.SUPER_ADMIN,
      UserRole.DZONGKHAG_ADMIN,
      UserRole.GEWOG_OPERATOR,
      UserRole.METER_READER,
      UserRole.TECHNICIAN,
      UserRole.QUALITY_INSPECTOR,
      UserRole.FINANCIAL_OFFICER,
      UserRole.VIEWER,
      UserRole.CONSUMER,
    ],
    [UserRole.DZONGKHAG_ADMIN]: [
      UserRole.DZONGKHAG_ADMIN,
      UserRole.GEWOG_OPERATOR,
      UserRole.METER_READER,
      UserRole.TECHNICIAN,
      UserRole.QUALITY_INSPECTOR,
      UserRole.FINANCIAL_OFFICER,
      UserRole.VIEWER,
    ],
    [UserRole.GEWOG_OPERATOR]: [
      UserRole.GEWOG_OPERATOR,
      UserRole.METER_READER,
      UserRole.TECHNICIAN,
      UserRole.VIEWER,
    ],
    [UserRole.METER_READER]: [UserRole.METER_READER],
    [UserRole.TECHNICIAN]: [UserRole.TECHNICIAN],
    [UserRole.QUALITY_INSPECTOR]: [UserRole.QUALITY_INSPECTOR],
    [UserRole.FINANCIAL_OFFICER]: [UserRole.FINANCIAL_OFFICER],
    [UserRole.VIEWER]: [UserRole.VIEWER],
    [UserRole.CONSUMER]: [UserRole.CONSUMER],
  }

  return roleMap[user.role as UserRole] || []
}
