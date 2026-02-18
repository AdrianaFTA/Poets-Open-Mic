import express from "express";
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
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 title: "A Quiet Night"
 *                 content: "The stars shine bright in the quiet night."
 *                 user_id: 1
 *               - id: 2
 *                 title: "Morning Dew"
 *                 content: "The sun rises over the hills."
 *                 user_id: 2
 *   post:
 *     summary: Create a new poem
 *     tags:
 *       - Poems
 *     security:
 *       - bearerAuth: []
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
 *                 example: "A Quiet Night"
 *               content:
 *                 type: string
 *                 example: "The stars shine bright in the quiet night."
 *     responses:
 *       201:
 *         description: Poem created successfully
 *       400:
 *         description: Missing title or content
 *       500:
 *         description: Error when saving poem
 */

router.get("/", async (req, res) => {
  try {
    const poems = await db.query(
      "SELECT * FROM poems WHERE status = 'published' ORDER BY id DESC"
    );
    res.json(poems.rows);
  } catch (err) {
    console.error("Get Poems ERROR:", err);
    res.status(500).json({ message: "Error when fetching poems" });
  }
});


/**
 * CREATE PUBLISHED POEM
 */
router.post("/publish", authenticateToken, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content)
      return res.status(400).json({ message: "Title and content required" });

    const result = await db.query(
      `INSERT INTO poems(title, content, user_id, status)
       VALUES($1, $2, $3, 'published')
       RETURNING *`,
      [title, content, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Publish Poem ERROR:", err);
    res.status(500).json({ message: "Error when saving poem" });
  }
});


/**
 * SAVE DRAFT
 */
router.post("/draft", authenticateToken, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content)
      return res.status(400).json({ message: "Title and content required" });

    const result = await db.query(
      `INSERT INTO poems(title, content, user_id, status)
       VALUES($1, $2, $3, 'draft')
       RETURNING *`,
      [title, content, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Save Draft ERROR:", err);
    res.status(500).json({ message: "Error when saving draft" });
  }
});


/**
 * GET LOGGED IN USER'S POEMS
 */
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const poems = await db.query(
      "SELECT * FROM poems WHERE user_id = $1 ORDER BY id DESC",
      [req.user.id]
    );

    res.json(poems.rows);
  } catch (err) {
    console.error("Get User Poems ERROR:", err);
    res.status(500).json({ message: "Error fetching user poems" });
  }
});


/**
 * UPDATE POEM (for editing draft or publishing later)
 */
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { title, content, status } = req.body;

    const result = await db.query(
      `UPDATE poems
       SET title = $1,
           content = $2,
           status = $3
       WHERE id = $4
       AND user_id = $5
       RETURNING *`,
      [title, content, status, req.params.id, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Update Poem ERROR:", err);
    res.status(500).json({ message: "Error updating poem" });
  }
});

export default router;