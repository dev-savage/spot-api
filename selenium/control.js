const express = require("express");
const app = express();
const port = 5000;
const run = require("./run");
const VM = "";
let PLAY = false;

app.post("/start", (req, res) => {
	PLAY = true;
	res.send("started");
});

app.post("/kill", (req, res) => {
	PLAY = false;
	res.send("killed");
});

app.listen(port, () =>
	console.log(`Example app listening at http://localhost:5000`)
);

const start = async () => {
	await run.main();
	if (PLAY) {
		start();
	} else {
		let interval;
		interval = setInterval(async function () {
			if (PLAY) {
				clearInterval(interval);
				start();
			}
		}, 10000);
	}
};

start();
start();
start();
