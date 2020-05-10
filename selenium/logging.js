const axios = require("axios");

const login = (user) => {
	axios
		.post("http://localhost:3000/logins", {
			email: user,
			type: 1,
		})
		.then((res) => {
			console.log("Logged login");
		});
};

const logout = (user) => {
	axios
		.post("http://localhost:3000/logins", {
			email: user,
			type: 0,
		})
		.then((res) => {
			console.log("Logged logout");
		});
};

module.exports = { login, logout };
