const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const pool = require("./db");
const authenticateToken = require("./middleware/auth");
const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

// Secret key for JWT
const SECRET_KEY = "mysecretkey";

// ========================
// LOGIN API
// ========================
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid Email or Password",
      });
    }

    const user = result.rows[0];

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid Email or Password",
      });
    }

    // Generate JWT Token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    res.json({
      message: "Login Successful",
      token: token,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

// ========================
// FETCH FIRST 30 RECORDS
// ========================
app.get("/api/sensex", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT trade_date, open, close
      FROM sensex_data
      ORDER BY trade_date DESC
      LIMIT 30
    `);

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Database Error",
    });
  }
});

// ========================
// START SERVER
// ========================
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});