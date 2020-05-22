const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const moment = require("moment");
const db = require("../utils/database");

// Overall Plays SQL
/*
This year by months:
	select count(count), Month(date_of_play)  from spotify.plays  
	where date_of_play>'2020-01-01 00:00:00'
	group by Year(date_of_play) , Month(date_of_play) 

This month by weeks


This Week by day
	SELECT *
FROM   plays
WHERE  YEARWEEK(`date_of_play`, 1) = YEARWEEK(CURDATE(), 1)



BARCHART ALBUM
Total for each Album in Current Month
	SELECT album, count(count) as total
	FROM   plays
	WHERE  MONTH(`date_of_play`) = MONTH(CURDATE()) group by album

Total for each Album in Current Week
	SELECT album, sum(count) as total
	FROM   plays
	WHERE  WEEK(`date_of_play`) = WEEK(CURDATE()) group by album

Total for each Album in last 7 days 
	SELECT album, SUM(count) as total
	FROM   plays
	WHERE  DAY(`date_of_play`) > (DAY(CURDATE())-7) group by album

Total for each Album in Current Day
	SELECT album, sum(count) as total
	FROM   plays
	WHERE  DAY(`date_of_play`) = DAY(CURDATE()) group by album

*/

router.get("/barchart/:type/:time", function (req, res, next) {
	const type = req.params.type; // artist or album
	const time = req.params.time; // current year, current month, current week, last 7 days
	const sql = determineSQL(type, time);
	db.pool.getConnection(function (err, conn) {
		if (err) return res.send(err);
		query(conn, sql)
			.then((result) => res.send(result))
			.catch((err) => res.send(err));
		conn.release();
	});
});

const determineSQL = (type, time) => {
	switch (time) {
		case "YEAR": {
			return `SELECT ${type} as item, SUM(count) as total FROM plays WHERE  YEAR(date_of_play) = YEAR(CURDATE()) group by ${type}`;
		}
		case "MONTH": {
			return `SELECT ${type} as item, SUM(count) as total FROM plays WHERE  MONTH(date_of_play) = MONTH(CURDATE()) group by ${type}`;
		}
		case "WEEK": {
			return `SELECT ${type} as item, sum(count) as total FROM plays WHERE  WEEK(date_of_play) = WEEK(CURDATE()) group by ${type}`;
		}
		case "7DAYS": {
			return `SELECT ${type} as item, SUM(count) as total FROM plays WHERE  DAY(date_of_play) > (DAY(CURDATE())-7) group by ${type}`;
		}
	}
};

const query = (connection, sql) => {
	return new Promise((resolve, reject) => {
		connection.query(sql, function (err, res, f) {
			if (err) reject(err);
			resolve(res);
		});
	});
};

router
	.get("/", (req, res, next) => {
		db.pool.getConnection(function (err, connection) {
			connection.query(selectAll(), function (error, results, fields) {
				connection.release();
				if (err) {
					console.log(error);
					res.send("Error getting play details");
				} else {
					res.send(results);
				}
			});
		});
	})
	.post("/", (req, res, next) => {
		db.pool.getConnection(function (err, connection) {
			const album = req.body.album;
			const artist = req.body.artist;
			const d = moment(new Date()).format("YYYY-MM-DD") + " 00:00:00";
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
				if (err) console.log(err);
				res.send(results);
			});
		});
	});

router.get("/month", (req, res, next) => {
	let results = [];
	db.pool.getConnection(function (err, connection) {
		connection.query(selectGivenMonth("january"), function (e, r, f) {
			if (r[0] && r[0].count) {
				let t = 0;
				for (let i = 0; i < r.length; i++) {
					t += parseInt(r[i].count);
				}
				results.push(t);
			} else {
				results.push(0);
			}
			connection.query(selectGivenMonth("february"), function (e, r, f) {
				if (r[0] && r[0].count) {
					let t = 0;
					for (let i = 0; i < r.length; i++) {
						t += parseInt(r[i].count);
					}
					results.push(t);
				} else {
					results.push(0);
				}
				connection.query(selectGivenMonth("march"), function (e, r, f) {
					if (r[0] && r[0].count) {
						let t = 0;
						for (let i = 0; i < r.length; i++) {
							t += parseInt(r[i].count);
						}
						results.push(t);
					} else {
						results.push(0);
					}
					connection.query(selectGivenMonth("april"), function (e, r, f) {
						if (r[0] && r[0].count) {
							let t = 0;
							for (let i = 0; i < r.length; i++) {
								t += parseInt(r[i].count);
							}
							results.push(t);
						} else {
							results.push(0);
						}
						connection.query(selectGivenMonth("may"), function (e, r, f) {
							if (r[0] && r[0].count) {
								let t = 0;
								for (let i = 0; i < r.length; i++) {
									t += parseInt(r[i].count);
								}
								results.push(t);
							} else {
								results.push(0);
							}
							connection.query(selectGivenMonth("june"), function (e, r, f) {
								if (r[0] && r[0].count) {
									let t = 0;
									for (let i = 0; i < r.length; i++) {
										t += parseInt(r[i].count);
									}
									results.push(t);
								} else {
									results.push(0);
								}
								connection.query(selectGivenMonth("july"), function (e, r, f) {
									if (r[0] && r[0].count) {
										let t = 0;
										for (let i = 0; i < r.length; i++) {
											t += parseInt(r[i].count);
										}
										results.push(t);
									} else {
										results.push(0);
									}
									connection.query(selectGivenMonth("august"), function (
										e,
										r,
										f
									) {
										if (r[0] && r[0].count) {
											let t = 0;
											for (let i = 0; i < r.length; i++) {
												t += parseInt(r[i].count);
											}
											results.push(t);
										} else {
											results.push(0);
										}
										connection.query(selectGivenMonth("september"), function (
											e,
											r,
											f
										) {
											if (r[0] && r[0].count) {
												let t = 0;
												for (let i = 0; i < r.length; i++) {
													t += parseInt(r[i].count);
												}
												results.push(t);
											} else {
												results.push(0);
											}
											connection.query(selectGivenMonth("october"), function (
												e,
												r,
												f
											) {
												if (r[0] && r[0].count) {
													let t = 0;
													for (let i = 0; i < r.length; i++) {
														t += parseInt(r[i].count);
													}
													results.push(t);
												} else {
													results.push(0);
												}
												connection.query(
													selectGivenMonth("november"),
													function (e, r, f) {
														if (r[0] && r[0].count) {
															let t = 0;
															for (let i = 0; i < r.length; i++) {
																t += parseInt(r[i].count);
															}
															results.push(t);
														} else {
															results.push(0);
														}
														connection.query(
															selectGivenMonth("december"),
															function (e, r, f) {
																if (r[0] && r[0].count) {
																	let t = 0;
																	for (let i = 0; i < r.length; i++) {
																		t += parseInt(r[i].count);
																	}
																	results.push(t);
																} else {
																	results.push(0);
																}
																connection.release();
																res.send(results);
															}
														);
													}
												);
											});
										});
									});
								});
							});
						});
					});
				});
			});
		});
	});
});

router.get("/:album", (req, res, next) => {
	db.pool.getConnection(function (err, connection) {
		connection.query(selectPlays(req), function (error, results, fields) {
			connection.release();
			if (err) {
				console.log(error);
				res.send("Error getting plays for album");
			} else {
				res.send(results);
			}
		});
	});
});

const selectAll = () => {
	return "SELECT * from plays";
};
const insertPlay = (req, d) => {
	return `UPDATE plays SET count = count + 1 where album='${req.body.album}'`;
};
const selectPlays = (req) => {
	return `select * from plays where album='${req.params.album}'`;
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

module.exports = router;
