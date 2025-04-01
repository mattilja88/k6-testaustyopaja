import http from 'k6/http';
import { check } from 'k6';

export let options = {
  vus: 5,
  iterations: 20, // Suurempi määrä lisää todennäköisyyttä virheellisille testitapauksille
};

// Apufunktiot tarkistuksiin
function hasUppercase(str) {
  return /[A-Z]/.test(str);
}
function hasNumber(str) {
  return /[0-9]/.test(str);
}
function hasSpecialChar(str) {
  return /[^A-Za-z0-9]/.test(str);
}
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function () {
  const num = Math.floor(Math.random() * 100000);
  const shouldBreak = Math.random() < 0.4; // 40% tapauksista on virheellisiä

  let uname = `user_${__VU}_${__ITER}_${num}`;
  let email = `user${num}@example.com`;
  let password = "Testi1!";

  // 🚨 Tee tahallinen virhe
  if (shouldBreak) {
    const type = Math.floor(Math.random() * 4);
    switch (type) {
      case 0:
        password = "testi"; // ei isoja kirjaimia, numeroita tai erikoismerkkejä
        break;
      case 1:
        email = "virheellinenemail.com"; // puuttuu @
        break;
      case 2:
        uname = ""; // tyhjä käyttäjänimi
        break;
      case 3:
        password = "12345678"; // ei isoja kirjaimia tai erikoismerkkejä
        break;
    }
  }

  const payload = JSON.stringify({
    fname: "Matti",
    lname: "Meikäläinen",
    uname,
    email,
    password,
    address: "Testikatu 1",
    phone: "0401234567"
  });

  const headers = {
    'Content-Type': 'application/json',
  };

  const res = http.post('http://localhost:3000/register', payload, { headers });

  const responseBody = (() => {
    try {
      return JSON.parse(res.body);
    } catch {
      return {};
    }
  })();

  // 📋 Tulokset
  check(res, {
    '✅ status is 201 or 4xx': (r) => r.status === 201 || r.status >= 400,
    '✅ sähköposti validi': () => isValidEmail(email),
    '✅ salasana: iso kirjain': () => hasUppercase(password),
    '✅ salasana: numero': () => hasNumber(password),
    '✅ salasana: erikoismerkki': () => hasSpecialChar(password),
    '✅ userId palautui jos status 201': () =>
      res.status !== 201 || responseBody.userId !== undefined,
  });
}
