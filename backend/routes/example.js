const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const conn = await db.getConnection();
    const rows = await conn.query("SELECT * FROM example_table");
    conn.release();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Virhe tietokantayhteydessä");
  }
});

module.exports = router;
