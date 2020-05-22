const env = process.platform;

module.exports = {
	hostname: () => {
		if (env === "linux") {
			return "http://77.68.118.54";
		} else {
			return "http://localhost:3000";
		}
	},
	dbpw: () => {
		if (env === "linux") {
			return "1111";
		} else {
			return "!Doodlebitch100";
		}
	},
};
