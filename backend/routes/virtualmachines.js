const express = require("express");
const router = express.Router();
const db = require("../utils/database");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

router.get("/", (req, res, next) => {
	res.send("virtualmachines");
});

router.post("/start", async (req, res, next) => {
	const ip = req.body.ip;
	const user = req.body.user;
	const pass = req.body.pass;
	const name = req.body.name;
	const result = await ls();
	res.send(result);
});

async function ls() {
	const { stdout, stderr } = await exec("ls");
	return stdout;
}

module.exports = router;
