import express from 'express';
const router = express.Router();

const NLP_SERVICE_URL = 'http://localhost:5000';

/**
 * @openapi
 * /classify:
 *   post:
 *     summary: Classify a poem
 *     description: Sends text to the NLP classifier microservice
 *     tags:
 *       - NLP Analysis
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: The text of the poem to analyze
 *                 example: "The stars shine bright in the quiet night."
 *     responses:
 *       200:
 *         description: Classification successful
 *       400:
 *         description: Missing content in request body
 *       500:
 *         description: Internal server error or NLP service unreachable
 */

router.post("/", async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ message: "Poem content is required" });

  try {
    const response = await fetch(`${NLP_SERVICE_URL}/classify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({
        message: "Microservice error",
        details: errorData.error || errorData.message
      });
    }

    const classificationResult = await response.json();
    res.json({ message: "Classification successful", result: classificationResult });
  } catch (err) {
    console.error("CLASSIFY ROUTE ERROR:", err);
    res.status(500).json({ message: "Internal server error: Could not reach NLP service." });
  }
});

export default router;
