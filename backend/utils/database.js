const mysql = require("mysql");

const pool = mysql.createPool({
	connectionLimit: 50,
	host: "localhost",
	user: "root",
	password: "1111",
	database: "spotify",
});

module.exports = { pool };
