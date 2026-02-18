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



/**
 * I've set up the main public feed here. 
 * I'm making sure it only fetches poems where the status is 'published' 
 * so that nobody accidentally sees another user's private drafts.
 */
router.get("/", async (req, res) => {
  try {
    const poems = await db.query(
      "SELECT * FROM poems WHERE status = 'published' ORDER BY id DESC"
    );
    res.json(poems.rows);
  } catch (err) {
    console.error("I ran into an issue fetching the public feed:", err);
    res.status(500).json({ message: "Error when fetching poems" });
  }
});

/**
 * When a user is ready to share, I use this route to save the poem.
 * I've hardcoded the status to 'published' so it immediately shows up on the home page.
 */
router.post("/publish", authenticateToken, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content)
      return res.status(400).json({ message: "I need both a title and content to publish!" });

    const result = await db.query(
      `INSERT INTO poems(title, content, user_id, status)
       VALUES($1, $2, $3, 'published')
       RETURNING *`,
      [title, content, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("I couldn't publish the poem:", err);
    res.status(500).json({ message: "Error when saving poem" });
  }
});

/**
 * I built this route specifically for your 'Save Draft' button.
 * It's almost identical to publishing, but I set the status to 'draft' 
 * so it stays hidden from the main feed.
 */
router.post("/draft", authenticateToken, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content)
      return res.status(400).json({ message: "I need a title and content to save a draft!" });

    const result = await db.query(
      `INSERT INTO poems(title, content, user_id, status)
       VALUES($1, $2, $3, 'draft')
       RETURNING *`,
      [title, content, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("I failed to save the draft:", err);
    res.status(500).json({ message: "Error when saving draft" });
  }
});

/**
 * I created this route specifically for your Profile page.
 * Unlike the public feed, this asks the database for EVERYTHING belonging to 
 * the logged-in user (both drafts and published work) using their unique ID.
 */
router.get("/user", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // I'm pulling this from the verified token
    const result = await db.query(
      "SELECT * FROM poems WHERE user_id = $1 ORDER BY id DESC",
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("I had trouble fetching your personal poems:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * This is the route I use for editing. 
 * I've added a security check `AND user_id = $5` to make sure 
 * I don't let one user edit someone else's poem by mistake.
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

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "I couldn't find that poem or you don't own it." });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("I couldn't update the poem:", err);
    res.status(500).json({ message: "Error updating poem" });
  }
});

/**
 * I've added this delete route to handle both drafts and published poems.
 * I'm checking 'user_id' in the WHERE clause so that even if someone 
 * guesses a poem ID, they can't delete it unless they own it.
 */
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await db.query(
      "DELETE FROM poems WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "I couldn't find that poem, or you don't have permission to delete it." });
    }

    res.json({ message: "Poem deleted successfully!" });
  } catch (err) {
    console.error("I failed to delete the poem:", err);
    res.status(500).json({ message: "Server error during deletion" });
  }
});

export default router;
