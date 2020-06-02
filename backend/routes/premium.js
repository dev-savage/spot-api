const express = require("express");
const router = express.Router();
const db = require("../utils/database");

router.get("/", (req, res, next) => {
	db.pool.getConnection(function (err, connection) {
		if (err) console.log(err);
		connection.query(`select * from premium`, function (er, r, f) {
			if (er) return res.send(e);
			return res.send(r);
		});
	});
});

module.exports = router;
