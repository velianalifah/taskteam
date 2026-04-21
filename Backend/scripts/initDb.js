const fs = require("fs");
const path = require("path");
const mysql = require("mysql2");
require("dotenv").config();

const initFilePath = path.join(__dirname, "..", "database", "init.sql");
const sql = fs.readFileSync(initFilePath, "utf8");

const connection = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    multipleStatements: true
});

connection.query(sql, (error) => {
    if (error) {
        console.error("Gagal inisialisasi database:", error.message);
        connection.end();
        process.exit(1);
    }

    console.log("Database taskteam berhasil diinisialisasi.");
    connection.end();
});
