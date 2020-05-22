const axios = require("axios");

const randomFreeUser = () => {
	return new Promise((resolve, reject) => {
		axios
			.get("http://localhost:3000/api/users/random")
			.then((result) => {
				const user = result.data[0];
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
			.get("http://localhost:3000/albums/random")
			.then((result) => {
				resolve(result.data[0]);
			})
			.catch((e) => {
				console.log(e);
				reject(e);
			});
	});
};

const incrementAlbum = (album) => {
	console.log("incrementing", album);
	return new Promise((resolve, reject) => {
		axios
			.post(`http://localhost:3000/plays`, {
				album: album.name,
				artist: album.artist,
			})
			.then(() => {
				resolve();
			})
			.catch((e) => {
				console.log(e);
				reject(e);
			});
	});
};
module.exports = { randomFreeUser, getRandomAlbum, incrementAlbum };
