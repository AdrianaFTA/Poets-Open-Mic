import express from 'express';
const router = express.Router();
import authenticateToken from "../middleware/auth.js";
import db from "../db.js";

/**
 * @openapi
 * /api/poems:
 *   get:
 *     summary: Get all poems from the database
 *     tags:
 *       - Poems
 *     responses:
 *       200:
 *         description: List of poems retrieved successfully
 *   post:
 *     summary: Create a new poem
 *     tags:
 *       - Poems
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the poem
 *                 example: "A Quiet Night"
 *               content:
 *                 type: string
 *                 description: The text of the poem
 *                 example: "The stars shine bright in the quiet night."
 *     responses:
 *       201:
 *         description: Poem created successfully
 *       400:
 *         description: Missing title or content
 *       500:
 *         description: Error when saving poem
 */

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ message: "Title and content required" });

    const result = await db.query(
      `INSERT INTO poems(title, content, user_id) VALUES($1, $2, $3) RETURNING *`,
      [title, content, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Create Poem ERROR:", err);
    res.status(500).json({ message: "Error when saving poem" });
  }
});

router.get("/", async (req, res) => {
  try {
    const poems = await db.query("SELECT * FROM poems ORDER BY id DESC");
    res.json(poems.rows);
  } catch (err) {
    console.error("Get Poems ERROR:", err);
    res.status(500).json({ message: "Error when fetching poems" });
  }
});

export default router;
