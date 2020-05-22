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
		});
};

module.exports = { login, logout };
