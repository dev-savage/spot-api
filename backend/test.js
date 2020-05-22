const moment = require("moment");
const mysql = require("mysql");
const async = require("async");

const pool = mysql.createPool({
	connectionLimit: 30,
	host: "localhost",
	user: "root",
	password: "!Doodlebitch100",
	database: "spotify",
});

const addUsers = () => {
	// NEED TO IMPORT USERS
	const users = [];
	pool.getConnection(function (err, connection) {
		if (err) console.log(err);

		async.eachLimit(
			users,
			1,
			function (user, callback) {
				connection.query(insertUser(user), function (e, r, f) {
					if (e) console.log(e);
					callback();
				});
			},
			function (err) {
				if (err) {
					console.log(err);
				} else {
					console.log("All users added");
					connection.release();
				}
			}
		);
	});
};
const insertUser = (u) => {
	return `INSERT INTO users (email, password, loginworking, currentlyloggedin) VALUES ('${u.username}', '${u.password}', '1', '0');`;
};

const insertNewDayForPlay = (album, d) => {
	count = 0;
	return `insert into plays (album, count, date) values ('${album}', '${count}', '${d}')`;
};

const selectDayForPlay = (album, d) => {
	return `UPDATE plays SET count = count + 1 where album='${album}' and date='${d}'`;
};

const selectGivenMonth = (month) => {
	return `select * FROM spotify.plays where monthname(date)='${month}'`;
};
const selectLastWeek = () => {
	return `SELECT * FROM spotify.plays where date between date_sub(now(),INTERVAL 1 WEEK) and now()`;
};

const selectLastDay = () => {
	return `SELECT * FROM spotify.plays WHERE date >= NOW() - INTERVAL 1 DAY`;
};
