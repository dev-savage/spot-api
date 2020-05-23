const express = require("express");
const router = express.Router();
const db = require("../utils/database");

router
	.get("/", function (req, res, next) {
		db.pool.getConnection(function (err, connection) {
			connection.query(selectErrors(), function (error, results, fields) {
				if (error) throw error;
				connection.release();
				res.send(results);
			});
		});
	})
	.post("/", function (req, res, next) {
		db.pool.getConnection(function (err, connection) {
			connection.query(insertError(req), function (error, results, fields) {
				if (error) throw error;
				connection.release();
				res.send(results);
			});
		});
	});

const selectErrors = () => {
	return "select * from errors";
};
const insertError = (req) => {
	let e = req.body.error;
	let email = e.user.user ? e.user.user : "unknown";
	let pw = e.user.password ? e.user.password : "unknown";
	return `INSERT INTO spotify.errors (issue, ip_address, user, password, album) VALUES ('${e.reason}', '${e.ip}', '${email}', '${pw}', '${e.description}')`;
};

module.exports = router;
