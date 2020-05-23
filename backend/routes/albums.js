const express = require("express");
const router = express.Router();
const db = require("../utils/database");

router
	.get("/", (req, res, next) => {
		db.pool.getConnection(function (err, connection) {
			connection.query(selectAll(), function (error, results, fields) {
				if (error) throw error;
				connection.release();
				res.send(results);
			});
		});
	})
	.post("/", (req, res, next) => {
		db.pool.query(insertAlbum(req), (err, results, fields) => {
			if (err) {
				res.send("Error inserting album");
			} else {
				res.send("Success");
				pool.query(insertAlbumPlays(req), (err, res, fields) => {
					if (err) connection.release();
				});
			}
		});
	});

router.get("/random", (req, res, next) => {
	db.pool.getConnection(function (err, connection) {
		connection.query(selectRandom(), function (error, results, fields) {
			if (err) console.log(err);
			res.send(results);
		});
	});
});
router
	.get("/:name", (req, res, next) => {
		db.pool.getConnection(function (err, connection) {
			connection.query(selectAlbum(req), function (error, results, fields) {
				if (error) throw error;
				connection.release();
				res.send(results);
			});
		});
	})
	.delete("/:name", (req, res, next) => {
		db.pool.getConnection(function (err, connection) {
			console.log(deleteAlbum(req));
			connection.query(deleteAlbum(req), function (error, results, fields) {
				connection.release();
				if (error) {
					console.log(error);
					res.send("Error Deleting Album");
				} else {
					res.send(results);
				}
			});
		});
	});

const selectAll = () => {
	return "SELECT * from albums";
};
const insertAlbum = (req) => {
	return `INSERT INTO albums (name, url, artist) VALUES ('${req.body.name}', '${req.body.url}', '${req.body.artist}')`;
};

const insertAlbumPlays = (req) => {
	return `INSERT INTO plays (album, count) VALUES ('${req.body.name}', 1)`;
};
const selectAlbum = (req) => {
	return `select * from albums where name='${req.params.name}'`;
};
const deleteAlbum = (req) => {
	return `DELETE from albums WHERE name='${req.params.name}'`;
};

const selectRandom = () => {
	return "select * from spotify.albums order by rand() limit 1";
};

module.exports = router;
