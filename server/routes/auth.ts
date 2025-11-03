import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { query } from "../db";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const handleLogin = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    // Input validation
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and role are required"
      });
    }

    // Query user from database
    const result = await query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    const user = result.rows[0];

    // Check if user exists and verify role
    if (!user || user.role !== role) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials or insufficient permissions"
      });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials or insufficient permissions"
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Return success response
    return res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during login"
    });
  }
};

export const handleRegister = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role, company } = req.body;

    // Input validation
    if (!email || !password || !name || !role || !company) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Check if user already exists
    const existingUser = await query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user
    const result = await query(
      `INSERT INTO users (email, password, name, role, company) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, email, name, role, company`,
      [email, hashedPassword, name, role, company]
    );

    const newUser = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Return success response
    return res.status(201).json({
      success: true,
      data: {
        user: newUser,
        token
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during registration"
    });
  }
};