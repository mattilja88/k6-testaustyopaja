const express = require('express');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Middlewaret
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Reitit
const exampleRoutes = require('./routes/example');
const register = require('./routes/register')
app.use('/api/example', exampleRoutes);
app.use('/register', register)

// Testireitti
app.get('/', (req, res) => {
  res.send('Express toimii!');
});

// Palvelimen käynnistys
app.listen(PORT, () => {
  console.log(`Palvelin käynnissä portissa ${PORT}`);
});
