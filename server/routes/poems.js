const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const db = require("../db");

//create poem
router.post("/", authenticateToken, async (req, res) =>{
    try{
        const {title, content} = req.body;

        //input validation
        if (!title || !content){
            return res.status(400).json({message: "Title and context required for a poem"});

        }
        const result = await db.query(
            `INSERT INTO poems(title, content, user_id) VALUES($1, $2, $3) RETURNING*`, [title, content, req.user.id]
        );
        res.status(201).json(result.rows[0]);
    }catch (err) {
        console.error("Create Poem ERROR:", err);
        res.status(500).json({message: "Error when saving poem"});
    }
});

// get poems
router.get("/", async (req, res) => {
    try {
        const poems = await db.query("SELECT * FROM poems ORDER BY id DESC");
        res.json(poems.rows);
    }catch (err) {
        console.error("Get Poems ERROR:", err);
        res.status(500).json({message: "Error when fetching poems"});
    
    }
});
module.exports = router; 