import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { query } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const SALT_ROUNDS = 10;

interface User {
  id: number;
  email: string;
  role: string;
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(user: User): string {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    }, 
    JWT_SECRET,
    { expiresIn: "24h" }
  );
}

export function verifyToken(token: string): any {
  return jwt.verify(token, JWT_SECRET);
}

export async function authenticateUser(email: string, password: string, requiredRole?: string): Promise<{user: User; token: string} | null> {
  try {
    const result = await query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const user = result.rows[0];
    const validPassword = await comparePassword(password, user.password);

    if (!validPassword) {
      return null;
    }

    // If a specific role is required, check it
    if (requiredRole && user.role !== requiredRole) {
      return null;
    }

    const token = generateToken(user);
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      },
      token
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}

export function requireRole(roles: string[]) {
  return async (req: any, res: any, next: any) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ 
          success: false, 
          message: "No token provided" 
        });
      }

      const token = authHeader.split(" ")[1];
      const decoded = verifyToken(token);

      // Check if user's role is in the allowed roles
      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ 
          success: false, 
          message: "Insufficient permissions" 
        });
      }

      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token" 
      });
    }
  };
}