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
// REGISTER API
// ========================
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users(email, password) VALUES($1, $2)",
      [email, hashedPassword]
    );

    res.status(201).json({
      message: "Registration Successful",
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

// ========================
// LOGIN API
// ========================
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
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

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid Email or Password",
      });
    }

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
      token,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

// ========================
// ADD SENSEX RECORD
// ========================
app.post("/api/sensex", authenticateToken, async (req, res) => {

  const { trade_date, open, close } = req.body;

  try {

    await pool.query(
      `
      INSERT INTO sensex_data(trade_date, open, close)
      VALUES($1,$2,$3)
      `,
      [trade_date, open, close]
    );

    res.status(201).json({
      message: "Record Added Successfully",
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Database Error",
    });

  }

});

// ========================
// FETCH SENSEX DATA WITH PAGINATION
// ========================
app.get("/api/sensex", authenticateToken, async (req, res) => {

  try {

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 30;
    const offset = (page - 1) * limit;

    const countResult = await pool.query(
      "SELECT COUNT(*) FROM sensex_data"
    );

    const totalCount = parseInt(countResult.rows[0].count, 10);

    const dataResult = await pool.query(
      `
      SELECT trade_date, open, close
      FROM sensex_data
      ORDER BY trade_date DESC
      LIMIT $1 OFFSET $2
      `,
      [limit, offset]
    );

    res.json({
      data: dataResult.rows,
      totalCount,
      page,
      limit,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Database Error",
    });

  }

});

// ========================
// MONTHLY AVERAGE CLOSING PRICE
// ========================
app.get("/api/monthly-average", authenticateToken, async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT
        TO_CHAR(trade_date, 'Mon') AS month,
        EXTRACT(MONTH FROM trade_date) AS month_number,
        ROUND(AVG(close)::numeric, 2) AS average_close
      FROM sensex_data
      GROUP BY month_number, month
      ORDER BY month_number;
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
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});