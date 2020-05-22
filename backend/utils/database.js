const mysql = require("mysql");
const config = require("../../config");
const dbpw = config.dbpw();
const pool = mysql.createPool({
	connectionLimit: 50,
	host: "localhost",
	user: "root",
	password: dbpw,
	database: "spotify",
});

module.exports = { pool };
