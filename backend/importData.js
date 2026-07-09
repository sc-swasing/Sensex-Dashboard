const fs = require("fs");
const csv = require("csv-parser");
const pool = require("./db");

const records = [];

const filePath = "./Sensex_CSV_2018.csv";

console.log("Reading file:", filePath);

fs.createReadStream(filePath)
  .on("error", (err) => {
    console.error("❌ Error opening CSV:", err);
  })
  .pipe(csv())  /// Basically converting normal text into javascript objects
  .on("data", (row) => {
    records.push({
      trade_date: row.Date,
      open: parseFloat(row.Open),  //convert the string into number
      close: parseFloat(row.Close),
    });
  })
  .on("end", async () => {  // this will fired only once
    console.log(`CSV loaded. Records found: ${records.length}`);

    try {
      // Remove old data so you don't get duplicates
      await pool.query("TRUNCATE TABLE sensex_data RESTART IDENTITY;");

      records.sort(
        (a, b) => new Date(b.trade_date) - new Date(a.trade_date)
      );

      for (const record of records) {
        await pool.query(
          `INSERT INTO sensex_data (trade_date, open, close)
           VALUES ($1, $2, $3)`,
          [record.trade_date, record.open, record.close]
        );
      }

      console.log(`✅ ${records.length} records inserted successfully.`);
    } catch (err) {
      console.error("❌ Database Error:");
      console.error(err);
    } finally {
      await pool.end();
    }
  });