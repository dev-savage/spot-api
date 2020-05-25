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
			console.log(insertError(req));
			connection.query(insertError(req), function (error, results, fields) {
				connection.release();
				if (error) res.send(error);
				res.send(results);
			});
		});
	});

const selectErrors = () => {
	return "select * from errors";
};
const insertError = (req) => {
	let e = req.body.error;
	let email = e.user.email ? e.user.email : "Unknown";
	let pw = e.user.password ? e.user.password : "Unknown";
	const album = e.album ? e.album : "Not available";
	const description = e.description ? e.description : "Unknown";
	console.log(pw);
	return `INSERT INTO spotify.errors (issue, ip_address, user, password, album, description) VALUES ('${e.reason}', '${e.ip}', '${email}', '${pw}','${album}', '${description}')`;
};

module.exports = router;
