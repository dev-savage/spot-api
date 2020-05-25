const axios = require("axios");
const config = require("../config");
const ep = config.hostname();
const login = (user) => {
	axios
		.post(`${ep}/api/logins`, {
			email: user,
			type: 1,
		})
		.then((res) => {
			console.log("Logged login");
		})
		.catch((e) => {
			throw e;
		});
};

const logout = (user) => {
	axios
		.post(`${ep}/api/logins`, {
			email: user,
			type: 0,
		})
		.then((res) => {
			console.log("Logged logout");
		})
		.catch((e) => {
			throw e;
		});
};

const error = (e) => {
	axios
		.post(`${ep}/api/errors`, { error: e })
		.then((res) => {
			console.log("Logged error");
		})
		.catch((e) => {
			console.log(e);
			console.log("error logging error");
		});
};
module.exports = { login, logout, error };
