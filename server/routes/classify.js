router.post("/", (req, res) => {
  const { text } = req.body;

  // simple rule-based mock for demo
  const form = text.split("\n").length <= 3 ? "Haiku" : "Free Verse";
  const theme = text.includes("love") ? "Romance" : "General";

  res.json({ form, theme });
});