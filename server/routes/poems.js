const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const db = require("../db");

//create poem
router.post("/", authenticateToken, async (req, res) =>{
    try{
        const {title, content} = req.body;

        const result = await db.query(`INSERT INTO poems(title, content, user_id) VALUES($1, $2, $3) RETURNING *`, [title, content, req.user.id]);

        res.json(result.rows[0]);
    } catch  (err) {
        console.error("Create Poem ERROR:", err);
        res.status(500).json({ message: "Error when saving poem"});
    }
    });

    // get poems 
    router.get("/", async (req, res) =>{
        const poems = await db.query("SELECT * FROM poems ORDER BY id DESC");
        res.json(poems.rows);
    });

    module.exports = router;