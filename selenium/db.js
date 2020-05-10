const axios = require("axios");

const randomFreeUser = () => {
	return new Promise((resolve) => {
		axios.get("http://localhost:3000/users/random").then((result) => {
			const user = result.data[0];
			resolve(user);
		});
	});
};

const getRandomAlbum = () => {
	return new Promise((resolve) => {
		axios.get("http://localhost:3000/albums/random").then((result) => {
			resolve(result.data[0]);
		});
	});
};

const incrementAlbum = (album) => {
	console.log("incrementing", album);
	return new Promise((resolve) => {
		axios.post(`http://localhost:3000/plays`, { album: album }).then(() => {
			resolve();
		});
	});
};
module.exports = { randomFreeUser, getRandomAlbum, incrementAlbum };
