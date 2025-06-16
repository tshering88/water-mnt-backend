import { Request, Response } from "express";
import User from "../models/userModels";
import bcrypt from "bcrypt";
import { generateToken, handleError, isValidObjectId, sanitizeUser } from "../utils/userUtils";
import { IUser } from "../types/authTypes";
import mongoose from "mongoose";

// Register user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phone, cid, role, password } = req.body;

    // Validate only required fields
    if (!name || !phone || !cid || !role) {
      res.status(400).json({ error: "Fields required: name, phone, cid, role" });
      return;
    }

    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ phone }, { cid }] });
    if (existingUser) {
      res.status(409).json({ error: "Phone or CID already registered" });
      return;
    }

    // Hash password only if provided
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    // Create new user, conditionally including password
    const newUser = new User({
      name,
      phone,
      cid,
      role,
      ...(hashedPassword && { password: hashedPassword }), // Include only if defined
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      data: { id: newUser._id, name, phone, cid, role }
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: (err as Error).message });
  }
};


// Login user

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, password } = req.body;

    // Find by email OR username
    const user = await User.findOne({
      $or: [{ phone: identifier }, { cid: identifier }],
    })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    const token = generateToken({ userId: user._id.toString(), phone: user.phone, cid: user.cid, role: user.role });

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(400).json({ message: "Login failed", error: (err as Error).message });
  }
};

// Get profile
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    res.status(200).json({ data: sanitizeUser(req.user), message: `Welcome back, ${req.user.name}`, });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error: (error as Error).message });
  }
};

// Get all users
export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().lean();

    // Sanitize each user in the array
    const sanitizedUsers = users.map(user => sanitizeUser(user));

    res.status(200).json({
      message: 'Users fetched successfully',
      data: sanitizedUsers,
    });
  } catch (error) {
    handleError(res, error);
  }
}
// Update user


export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    const { name, phone, cid, role } = req.body;
    console.log("Received update data:", req.body);

    const updateData: Partial<IUser> = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (cid) updateData.cid = cid;
    if (role) updateData.role = role;

    if (Object.keys(updateData).length === 0) {
      res.status(400).json({ message: "No valid fields to update" });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "User updated", data: sanitizeUser(updatedUser) });
  } catch (err: any) {
    console.error("Update failed:", err);
    res.status(400).json({
      message: "Update failed",
      error: err.message,
      details: err.errors || null,
    });
  }
};


// Delete user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id, res)) return;


    const deleted = await User.findByIdAndDelete(id).lean();
    if (!deleted) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    handleError(res, err);
  }
};
