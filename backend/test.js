const moment = require("moment");
const mysql = require("mysql");

const pool = mysql.createPool({
	connectionLimit: 30,
	host: "localhost",
	user: "root",
	password: "!Doodlebitch100",
	database: "spotify",
});

pool.getConnection(function (err, connection) {
	connection.query(selectDayForPlay(album, d), function (
		error,
		results,
		fields
	) {
		if (error) console.log(error);
		if (results.affectedRows != 1) {
			connection.query(insertNewDayForPlay(album, d), function (
				error,
				results,
				fields
			) {
				if (error) console.log(error);
			});
		}
		connection.release();
		console.log("done");
	});
});

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
