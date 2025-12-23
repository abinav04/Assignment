import mongoose from "mongoose";
import User from "../models/User.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


// Controller function for getting all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Controller function for getting a user by ID
export const getUserById = async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ message: "Invalid user ID format" });
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

// Controller function for creating a new user
export const createUser = async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  if (!email.match(emailRegex)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch {
    res.status(500).json({ message: "Failed to create user" });
  }
};

// Controller function for updating a user
export const updateUser = async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ message: "Invalid user ID format" });
  }

  if (req.body.email && !req.body.email.match(emailRegex)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    if (req.body.email) {
      const existingUser = await User.findOne({
        email: req.body.email,
        _id: { $ne: id },
      });

      if (existingUser) {
        return res.status(409).json({ message: "Email already exists" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch {
    res.status(500).json({ message: "Failed to update user" });
  }
};

// Controller function for deleting a user
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ message: "Invalid user ID format" });
  }

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(204).send();
  } catch {
    res.status(500).json({ message: "Failed to delete user" });
  }
};
