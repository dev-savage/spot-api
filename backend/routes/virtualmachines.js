const express = require("express");
const router = express.Router();
const db = require("../utils/database");

router.post("/start", async (req, res, next) => {
	const ip = req.body.ip;
	const user = req.body.user;
	const pass = req.body.pass;
	const name = req.body.name;
	const result = await ls();
	res.send(result);
});

router.post("/end", (req, res, next) => {
	db.pool.getConnection(function (err, connection) {
		connection.query(insertError(req), function (error, results, fields) {
			if (error) throw error;
			connection.release();
			res.send(results);
		});
	});
});

router.get("/", (req, res, next) => {
	const sql = `SELECT status, count, last_play FROM spotify.vm`;
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
