const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const moment = require("moment");
const db = require("../utils/database");

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
