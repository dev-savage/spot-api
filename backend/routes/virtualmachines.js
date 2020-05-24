const express = require("express");
const router = express.Router();
const db = require("../utils/database");

router.post("/status", (req, res, next) => {
	const vm = req.body.vm;
	const status = req.body.status;
	const sql = `UPDATE spotify.vm SET status='${status}' WHERE vm='${vm}'`;
	db.pool.getConnection(function (err, connection) {
		connection.query(sql, function (error, results, fields) {
			if (error) throw error;
			connection.release();
			res.send(results);
		});
	});
});

router.get("/", (req, res, next) => {
	const sql = `SELECT *  FROM spotify.vm`;
	db.pool.getConnection(function (err, connection) {
		connection.query(sql, function (error, results, fields) {
			if (error) throw error;
			connection.release();
			res.send(results);
		});
	});
});
router.get("/today", (req, res, next) => {
	const vm = req.query.vm;
	const sql = `SELECT status, count, last_play FROM spotify.vm where vm='${vm}'`;
	console.log(sql);
	db.pool.getConnection(function (err, connection) {
		connection.query(sql, function (error, results, fields) {
			if (error) throw error;
			connection.release();
			res.send(results);
		});
	});
});

module.exports = router;
