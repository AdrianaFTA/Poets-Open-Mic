import express from 'express';
const router = express.Router();

const NLP_SERVICE_URL = 'http://localhost:5000';

/**
 * @openapi
 * /classify:
 *   post:
 *     summary: Classify a poem
 *     description: Sends poem text to NLP classifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The poem text
 *     responses:
 *       200:
 *         description: Classification result
 */

router.post("/", async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({
      message: "Poem content is required for classification."
    });
  }

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

    res.json({
      message: "Classification successful",
      result: classificationResult,
    });

  } catch (err) {
    console.error("CLASSIFY ROUTE ERROR:", err);
    res.status(500).json({
      message: "Internal server error: Could not reach NLP service."
    });
  }
});

export default router;
