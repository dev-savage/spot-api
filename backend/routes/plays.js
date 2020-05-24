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
router.get("/test", function (req, res, next) {
	db.pool.getConnection(function (err, conn) {
		if (err) console.log(err);
		conn.query("select * from users", function (e, r, f) {
			conn.release();
			if (err) console.log(err);
			res.send(r);
		});
	});
});
router.get("/barchart/:type/:time", function (req, res, next) {
	const type = req.params.type; // artist or album
	const time = req.params.time; // current year, current month, current week, last 7 days
	const sql = determineSQL(type, time);
	db.pool.getConnection(function (err, conn) {
		if (err) console.log(err);
		query(conn, sql)
			.then((result) => res.send(result))
			.catch((err) => res.send(err));
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

router.get("/linechart/:time", function (req, res, next) {
	const time = req.params.time;
	const sql = determineLineSQL(time);
	db.pool.getConnection(function (err, conn) {
		if (err) console.log(err);
		query(conn, sql)
			.then((result) => res.send(result))
			.catch((err) => res.send(err));
	});
});

const determineLineSQL = (time) => {
	switch (time) {
		case "WEEK": {
			return "Select DayName(`date_of_play`) MontnameYear, SUM(`count`) as count FROM  plays  where  DAY(date_of_play) > (DAY(CURDATE()-7)) GROUP BY DayName(`date_of_play`) ORDER by MIN(`date_of_play`)";
		}
		case "MONTH": {
			return "SELECT DAY(date_of_play) as MontnameYear, SUM(count) as count FROM plays  WHERE WEEK(date_of_play) >= WEEK(CURDATE()) - 4 GROUP BY DAY(date_of_play)ORDER by MIN(date_of_play)";
		}
		case "YTD": {
			return `Select DATE_FORMAT(date_of_play,'%M') MontnameYear, SUM(count) as count FROM plays GROUP BY DATE_FORMAT(date_of_play,'%M') ORDER by MIN(date_of_play)`;
		}
		default: {
			return `Select DATE_FORMAT(date_of_play,'%M %Y') MontnameYear, SUM(count) as count FROM plays GROUP BY DATE_FORMAT(date_of_play,'%M %Y') ORDER by MIN(date_of_play)`;
		}
	}
};
const query = (connection, sql) => {
	return new Promise((resolve, reject) => {
		connection.query(sql, function (err, res, f) {
			connection.release();
			console.log(res);
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
			const vm = req.body.vm;
			const d = moment(new Date()).format("YYYY-MM-DD") + " 00:00:00";
			connection.query(VMOnLatestDay(vm, date), function (e, r, f) {
				if (e) throw e;
				connection.query(getSQLToUpdateVM(r, vm, date), function (e, r, f) {
					if (e) throw e;
					connection.query(selectDayForPlay(album, d), function (
						error,
						results,
						fields
					) {
						if (error) console.log(error);
						if (results.affectedRows != 1) {
							connection.query(insertNewDayForPlay(album, artist, d), function (
								e,
								r,
								f
							) {
								if (e) console.log(e);
								connection.release();
								res.send(r);
							});
						} else {
							connection.release();
							if (err) console.log(err);
							res.send(results);
						}
					});
				});
			});
		});
	});

router.get("/today", (req, res, next) => {
	db.pool.getConnection(function (err, connection) {
		const tp = `SELECT SUM(count) as total FROM plays WHERE DAY(date_of_play) > (DAY(CURDATE()-1)) and  MONTH(date_of_play) = MONTH(CURDATE())`;
		connection.query(tp, function (error, results, fields) {
			connection.release();
			res.send(results);
		});
	});
});

router.get("/yesterday", (req, res, next) => {
	db.pool.getConnection(function (err, connection) {
		const tp = `SELECT SUM(count) as total FROM plays WHERE DAY(date_of_play) = (DAY(CURDATE()-1)) and  MONTH(date_of_play) = MONTH(CURDATE())`;
		connection.query(tp, function (error, results, fields) {
			connection.release();
			res.send(results);
		});
	});
});
router.get("/thismonth", (req, res, next) => {
	db.pool.getConnection(function (err, connection) {
		const tp = `SELECT SUM(count) as total FROM plays WHERE MONTH(date_of_play) = MONTH(CURDATE())`;
		connection.query(tp, function (error, results, fields) {
			connection.release();
			res.send(results);
		});
	});
});
router.get("/lastmonth", (req, res, next) => {
	db.pool.getConnection(function (err, connection) {
		const tp = `SELECT SUM(count) as total FROM plays WHERE MONTH(date_of_play) = MONTH(CURDATE()-1)`;
		connection.query(tp, function (error, results, fields) {
			connection.release();
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

const insertNewDayForPlay = (album, artist, d) => {
	count = 0;
	return `insert into plays (album, artist, count, date_of_play) values ('${album}', '${artist}', '${count}', '${d}')`;
};

const selectDayForPlay = (album, d) => {
	return `UPDATE plays SET count = count + 1 where album='${album}' and date_of_play='${d}'`;
};

const selectGivenMonth = (month) => {
	return `select * FROM spotify.plays where monthname(date_of_play)='${month}'`;
};
const selectLastWeek = () => {
	return `SELECT * FROM spotify.plays where date_of_play between date_sub(now(),INTERVAL 1 WEEK) and now()`;
};

const selectLastDay = () => {
	return `SELECT * FROM spotify.plays WHERE date_of_play >= NOW() - INTERVAL 1 DAY`;
};

// VM STUFF
const VMOnLatestDay = (vm, date) => {
	return `SELECT * FROM spotify.vm where vm='${vm}' and current_day='${date}'`;
};

const getSQLToUpdateVM = (r, vm, d) => {
	if (r.length === 0) {
		return `UPDATE spotify.vm SET count='1', current_day='${d}' WHERE vm='${vm}'`;
	} else {
		return `UPDATE spotify.vm SET count = count + 1 where vm='${vm}'`;
	}
};

module.exports = router;
