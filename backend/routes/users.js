const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const db = require("../utils/database");

router
	.get("/", (req, res, next) => {
		db.pool.getConnection(function (err, connection) {
			if (err) console.log(err);
			connection.query(selectAllUsers(), function (error, results, fields) {
				if (error) throw error;
				connection.release();
				res.send(results);
			});
		});
	})
	.post("/", (req, res, next) => {
		db.pool.getConnection(function (err, connection) {
			connection.query(insertUser(req), (err, results, fields) => {
				connection.release();
				if (err) console.log(err);
				if (err) {
					res.send("Error inserting user");
				} else {
					res.send("Success");
				}
			});
		});
	});

router.get("/random", (req, res, next) => {
	db.pool.getConnection(function (err, connection) {
		connection.query(randomFreeUser(), function (err, results, fields) {
			if (err) console.log(error);
			connection.release();
			res.send(results);
		});
	});
});

router
	.get("/:email", (req, res, next) => {
		db.pool.getConnection(function (err, connection) {
			connection.query(selectUser(req), function (error, results, fields) {
				if (error) throw error;
				connection.release();
				res.send(results);
			});
		});
	})
	.post("/brokenlogin", (req, res, next) => {
		const email = req.body.email;
		db.pool.getConnection(function (err, connection) {
			console.log(setLoginBroken(email));
			connection.query(setLoginBroken(email), (err, results, fields) => {
				connection.release();
				if (err) console.log(err);
				if (err) {
					res.send("Couldn't set login broke");
				} else {
					res.send("Success");
				}
			});
		});
	})
	.put("/:email", (req, res, next) => {
		db.pool.getConnection(function (err, connection) {
			connection.query(selectUser(req), function (error, results, fields) {
				if (error) throw error;
				connection.query(updatePass(req), function (err, results, fields) {
					connection.release();
					if (error) {
						res.send("Error Updating Password");
					} else {
						res.send(results);
					}
				});
			});
		});
	})
	.delete("/:email", (req, res, next) => {
		db.pool.getConnection(function (err, connection) {
			connection.query(deleteUser(req), function (error, results, fields) {
				connection.release();
				if (error) {
					res.send("Error Deleting User");
				} else {
					res.send(results);
				}
			});
		});
	});

const selectAllUsers = () => {
	return "SELECT * from users";
};
const insertUser = (req) => {
	return `INSERT INTO users (email, password, loginworking, currentlyloggedin) VALUES ('${req.body.email}', '${req.body.password}', 1, 0)`;
};
const selectUser = (req) => {
	return `select * from users where email='${req.params.email}'`;
};
const setLoginBroken = (email) => {
	return `update users set loginworking='0' where email='${email}'`;
};
const updatePass = (req) => {
	return `update users set password='${req.body.password}', loginworking=1 where email='${req.params.email}'`;
};
const deleteUser = (req) => {
	return `DELETE from users WHERE email='${req.params.email}'`;
};

const randomFreeUser = () => {
	return `select * from users where loginworking = 1 AND  currentlyloggedin=0 order by rand() limit 1`;
};
module.exports = router;
