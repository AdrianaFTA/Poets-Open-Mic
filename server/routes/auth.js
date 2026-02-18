import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "test@example.com"
 *               username:
 *                 type: string
 *                 example: "poet123"
 *               password:
 *                 type: string
 *                 example: "mypassword"
 *     responses:
 *       200:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             example:
 *               message: "Registration successful"
 *               user:
 *                 id: 1
 *                 email: "test@example.com"
 *                 username: "poet123"
 *       400:
 *         description: Missing fields or email already registered
 *       500:
 *         description: Server error during registration
 */
router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password)
      return res.status(400).json({ message: "All fields are required." });

    const existing = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0)
      return res.status(400).json({ message: "Email already registered." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      `INSERT INTO users (email, username, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, email, username`,
      [email, username, hashedPassword]
    );

    res.json({ message: "Registration successful", user: result.rows[0] });
  } catch (err) {
    console.error("Register ERROR:", err);
    res.status(500).json({ message: "Server error during registration." });
  }
});

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "test@example.com"
 *               password:
 *                 type: string
 *                 example: "mypassword"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               message: "Login successful"
 *               token: "jwt.token.here"
 *       400:
 *         description: Missing fields
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error during login
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required." });

    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) return res.status(401).json({ message: "Invalid credentials." });

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: "Invalid credentials." });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "2h" });
    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error during login." });
  }
});

export default router;
