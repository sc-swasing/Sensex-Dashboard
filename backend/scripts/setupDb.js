/**
 * ============================================
 *  DATABASE SETUP & CSV SEED SCRIPT
 * ============================================
 *
 *  This script runs automatically on first build.
 *  It performs 3 steps:
 *
 *  STEP 1 — Create the database (if it doesn't exist)
 *  STEP 2 — Create tables (users + sensex_data)
 *  STEP 3 — Seed CSV data (only if sensex_data is empty)
 *
 *  Usage:  node scripts/setupDb.js
 *          npm run setup
 * ============================================
 */

require("dotenv").config();
const { Client } = require("pg");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

// ─────────────────────────────────────────────
//  STEP 1: Create the database if it doesn't exist
// ─────────────────────────────────────────────
async function createDatabase() {
  // Connect to the default 'postgres' database first
  // (we can't connect to a DB that doesn't exist yet!)
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: "postgres", // default system database
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10),
  });

  try {
    await client.connect();

    // Check if our target database already exists
    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME]
    );

    if (result.rows.length === 0) {
      // Database doesn't exist — create it
      await client.query(`CREATE DATABASE "${process.env.DB_NAME}"`);
      console.log(`✅ Database "${process.env.DB_NAME}" created successfully.`);
    } else {
      console.log(`ℹ️  Database "${process.env.DB_NAME}" already exists. Skipping creation.`);
    }
  } finally {
    await client.end();
  }
}

// ─────────────────────────────────────────────
//  STEP 2: Create tables if they don't exist
// ─────────────────────────────────────────────
async function createTables() {
  // Now connect to the actual application database
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10),
  });

  try {
    await client.connect();

    // Create 'users' table for authentication
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Table 'users' is ready.");

    // Create 'sensex_data' table for stock data
    await client.query(`
      CREATE TABLE IF NOT EXISTS sensex_data (
        id SERIAL PRIMARY KEY,
        trade_date DATE NOT NULL,
        open NUMERIC(10, 2),
        high NUMERIC(10, 2),
        low NUMERIC(10, 2),
        close NUMERIC(10, 2)
      );
    `);
    console.log("✅ Table 'sensex_data' is ready.");
  } finally {
    await client.end();
  }
}

// ─────────────────────────────────────────────
//  STEP 3: Seed CSV data (only on first run)
// ─────────────────────────────────────────────
async function seedData() {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10),
  });

  try {
    await client.connect();

    // Check if data already exists — skip seeding if it does
    const countResult = await client.query("SELECT COUNT(*) FROM sensex_data");
    const existingCount = parseInt(countResult.rows[0].count, 10);

    if (existingCount > 0) {
      console.log(`ℹ️  sensex_data already has ${existingCount} records. Skipping CSV import.`);
      return;
    }

    // Read and parse the CSV file
    const csvPath = path.join(__dirname, "..", "Sensex_CSV_2018.csv");

    if (!fs.existsSync(csvPath)) {
      console.error(`❌ CSV file not found at: ${csvPath}`);
      console.error("   Please make sure 'Sensex_CSV_2018.csv' is in the backend/ folder.");
      return;
    }

    const records = [];

    await new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .on("error", reject)
        .pipe(csv())
        .on("data", (row) => {
          records.push({
            trade_date: row.Date,
            open: parseFloat(row.Open),
            high: parseFloat(row.High),
            low: parseFloat(row.Low),
            close: parseFloat(row.Close),
          });
        })
        .on("end", resolve);
    });

    console.log(`📄 CSV loaded. Found ${records.length} records.`);

    // Sort by date descending (newest first)
    records.sort((a, b) => new Date(b.trade_date) - new Date(a.trade_date));

    // Insert all records using a transaction for speed & safety
    await client.query("BEGIN");

    for (const record of records) {
      await client.query(
        `INSERT INTO sensex_data (trade_date, open, high, low, close)
         VALUES ($1, $2, $3, $4, $5)`,
        [record.trade_date, record.open, record.high, record.low, record.close]
      );
    }

    await client.query("COMMIT");
    console.log(`✅ ${records.length} records inserted successfully.`);
  } catch (err) {
    // Rollback on error
    await client.query("ROLLBACK").catch(() => {});
    throw err;
  } finally {
    await client.end();
  }
}

// ─────────────────────────────────────────────
//  RUN ALL STEPS
// ─────────────────────────────────────────────
async function main() {
  console.log("🚀 Starting database setup...\n");

  try {
    await createDatabase();
    await createTables();
    await seedData();

    console.log("\n🎉 Database setup complete! You can now start the server.");
  } catch (err) {
    console.error("\n❌ Setup failed:", err.message);
    process.exit(1);
  }
}

main();
