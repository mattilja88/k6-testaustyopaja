const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', async (req, res) => {
  console.log("📥 Saapuva data:", req.body);

  const { fname, lname, uname, email, password, address, phone } = req.body;

  if (!fname || !lname || !uname || !email || !password) {
    return res.status(400).json({ message: 'Täytä kaikki vaaditut kentät' });
  }

  // 📧 Sähköpostin validointi
  // regex testaus avattuna:
  // ensin testaa, että yksi tai useampi merkki, joka ei ole välilyönti tai @-merkki
  // tämän jälkeen täytyy olla @-merkki eikä mikään muu
  // Sitten on pakollinen vähintään yksi merkki, joka ei ole välilyönti eikä @-merkki
  // seuraavaksi pakollinen piste. 
  // lopuksi taas pakollinen merkki, joka ei ole välilyönti tai @-merkki
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Sähköpostiosoite ei ole kelvollinen' });
  }

  // 🔐 Salasanan tarkistus
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  if (!hasUpper || !hasNumber || !hasSpecial) {
    return res.status(400).json({
      message: 'Salasanan tulee sisältää vähintään yksi iso kirjain, numero ja erikoismerkki'
    });
  }

  try {
    const conn = await db.getConnection();

    const [existing] = await conn.query(
      'SELECT id FROM users WHERE uname = ? OR email = ?',
      [uname, email]
    );

    if (existing.length > 0) {
      conn.release();
      return res.status(409).json({ message: 'Käyttäjänimi tai sähköposti on jo käytössä' });
    }

    const [result] = await conn.query(
      'INSERT INTO users (fname, lname, uname, email, password, address, phone) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [fname, lname, uname, email, password, address || null, phone || null]
    );

    conn.release();
    return res.status(201).json({ message: 'Rekisteröinti onnistui', userId: result.insertId });

  } catch (err) {
    console.error("💥 Virhe palvelimella:", err);
    return res.status(500).json({ message: 'Jotain meni pieleen palvelimen puolella' });
  }
});

module.exports = router;
