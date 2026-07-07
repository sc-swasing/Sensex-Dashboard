const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

// API to fetch first 30 records
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
    res.status(500).json({ message: "Database Error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});