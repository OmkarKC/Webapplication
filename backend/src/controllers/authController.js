import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { config } from "../configs/index.js";

function createToken(user) {
  return jwt.sign(
    { userId: user.id, username: user.username },
    config.jwtSecret,
    { expiresIn: "1d" }
  );
}

export async function register(req, res, next) {
  try {
    const { firstName, lastName, username, password } = req.body;
    if (!firstName?.trim() || !lastName?.trim() || !username?.trim() || !password) {
      return res.status(400).json({ error: "First name, last name, username, and password are required." });
    }

    const existing = await User.findOne({ where: { username: username.trim() } });
    if (existing) return res.status(409).json({ error: "Username already taken." });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: username.trim(),
      passwordHash
    });

    res.status(201).json({
      token: createToken(user),
      id: user.id,
      username: user.username,
      fullName: `${user.firstName} ${user.lastName}`
    });
  } catch (err) { next(err); }
}

export async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    if (!username?.trim() || !password) {
      return res.status(400).json({ error: "Username and password are required." });
    }

    const user = await User.findOne({ where: { username: username.trim() } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    res.json({
      token: createToken(user),
      id: user.id,
      username: user.username,
      fullName: `${user.firstName} ${user.lastName}`
    });
  } catch (err) { next(err); }
}

export function logout(_req, res) {
  res.json({ message: "Logged out successfully." });
}