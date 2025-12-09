const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const { text } = req.body;

  const form = text.split("\n").length <= 3 ? "Haiku" : "Free Verse";
  const theme = text.includes("love") ? "Romance" : "General";

  res.json({ form, theme });
});

module.exports = router;