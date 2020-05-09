const mysql = require("mysql");
const pool = mysql.createPool({
	connectionLimit: 30,
	host: "localhost",
	user: "root",
	password: "!Doodlebitch100",
	database: "spotify",
});

const getConnection = () => {
	return new Promise((resolve, reject) => {
		pool
			.getConnection()
			.then((con) => resolve(con))
			.catch((err) => reject(err));
	});
};

module.exports = { getConnection };
