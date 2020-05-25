const express = require("express");
const router = express.Router();
const db = require("../utils/database");
router
	.get("/", (req, res, next) => {
		db.pool.getConnection(function (err, connection) {
			connection.query(selectAll(), function (error, results, fields) {
				connection.release();
				if (err) {
					console.log(error);
					res.send("Error getting login details");
				} else {
					res.send(results);
				}
			});
		});
	})
	.post("/", (req, res, next) => {
		const d = new Date().toISOString().slice(0, 19).replace("T", " ");
		db.pool.getConnection(function (err, connection) {
			if (err) console.log(err);
			connection.query(insertLog(req, d), function (error, results, fields) {
				connection.query(updateUserLogin(req), function (err, resu, fi) {
					connection.release();
					if (err) {
						console.log(error);
						res.send("Error logging login");
					} else {
						res.send(results);
					}
				});
			});
		});
	});

const selectAll = () => {
	return "SELECT * from logins";
};
const insertLog = (req, d) => {
	return `INSERT INTO logins (email, time, type) VALUES ('${req.body.email.email}', '${d}', '${req.body.type}')`;
};

const updateUserLogin = (req) => {
	const email = req.body.email;
	const type = req.body.type;
	return `UPDATE users SET currentlyloggedin='${type}' WHERE email='${email.email}'`;
};
module.exports = router;
