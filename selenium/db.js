const axios = require("axios");
const config = require("../config");
const ep = config.hostname();

const randomFreeUser = () => {
	return new Promise((resolve, reject) => {
		axios
			.get(`${ep}/api/users/random`)
			.then((result) => {
				const user = result.data[0];
				console.log("Got random user");
				resolve(user);
			})
			.catch((error) => {
				// Request made, and server responded
				if (error.response) {
					console.log(20);
					console.log(error.response.data);
					console.log(error.response.status);
					// console.log(error.response.headers);
				} else if (error.request) {
					reject("Database Server Unreachable");
				} else {
					console.log("19");

					// Something happened in setting up the request that triggered an Error
					// console.log("Error", error.message);
				}
				reject("eek");
			});
	});
};

const getRandomAlbum = () => {
	return new Promise((resolve, reject) => {
		axios
			.get(`${ep}/api/albums/random`)
			.then((result) => {
				console.log("Got random album");
				resolve(result.data[0]);
			})
			.catch((e) => {
				reject(e);
			});
	});
};

const incrementAlbum = (album, hostname) => {
	return new Promise((resolve, reject) => {
		axios
			.post(`${ep}/api/plays`, {
				album: album.name,
				artist: album.artist,
				hostname: hostname,
			})
			.then(() => {
				console.log("Incremented Album");
				resolve();
			})
			.catch((e) => {
				reject(e);
			});
	});
};

const setLoginBad = (email) => {
	return new Promise((resolve, reject) => {
		axios
			.post(`${ep}/users/${email}`)
			.then(() => {
				console.log("Set login as broken");
				resolve();
			})
			.catch((e) => {
				reject(e);
			});
	});
};
module.exports = {
	randomFreeUser,
	getRandomAlbum,
	incrementAlbum,
	setLoginBad,
};
