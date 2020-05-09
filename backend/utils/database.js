const mysql = require("mysql");

const pool = mysql.createPool({
	connectionLimit: 50,
	host: "localhost",
	user: "root",
	password: "!Doodlebitch100",
	database: "spotify",
});

module.exports = { pool };
