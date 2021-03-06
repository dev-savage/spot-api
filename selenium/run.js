const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const data = require("./data");
const log = require("./logging");
const db = require("./db.js");
var os = require("os");
var ifaces = os.networkInterfaces();
const randomTime = (max, min) => Math.floor(Math.random() * max + min);
const waitFor = (ms) => new Promise((r) => setTimeout(r, ms));
// const ip_getter = require("./ipaddress");
const getAddress = () => {
	let arr = [];
	Object.keys(ifaces).forEach(function (ifname) {
		var alias = 0;

		ifaces[ifname].forEach(function (iface) {
			if ("IPv4" !== iface.family || iface.internal !== false) {
				// skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
				return;
			}
			if (alias >= 1) {
				// this single interface has multiple ipv4 addresses
				arr.push(iface.address);
				return iface.address;
			} else {
				// this interface has only one ipv4 adress
				arr.push(iface.address);
				return iface.address;
			}
			++alias;
		});
	});
	return arr[0];
};
const ipaddress = getAddress(); //ip_getter.getAddress();

async function main() {
	let user;
	try {
		user = await db.randomFreeUser();
		// user = {
		// 	idusers: 1,
		// 	email: "super_k_dog@yahoo.com",
		// 	password: "freeshit",
		// 	loginworking: 1,
		// 	currentlyloggedin: 0,
		// };
	} catch (e) {
		// console.log("failed to get user");
	}
	let driver;
	try {
		try {
			const options = setOptions();
			driver = await createDriver(options);
		} catch (e) {
			console.log("fucked driver");
			throw {
				reason: "Failed to launch driver",
				ip: ipaddress,
				description: e,
			};
		}

		await waitFor(randomTime(5500, 2500));
		try {
			await openSite(driver);
			await waitFor(randomTime(5500, 2500));
		} catch (e) {
			throw {
				reason: "Failed to open Browser",
				ip: ipaddress,
				description: e,
			};
		}

		try {
			await openLoginScreen(driver);
			// console.log("Clicked Login Button");
			await waitFor(randomTime(5500, 2500));
		} catch (e) {
			throw {
				reason: "Failed to load login screen",
				ip: ipaddress,
				description: e,
			};
		}

		try {
			await login(driver, user);
		} catch (e) {
			await db.setLoginBad(user.email);
			// console.log("IP Address", ipaddress);
			throw {
				reason: "Failed to login user",
				ip: ipaddress,
				description: e,
				user: user,
			};
		}

		try {
			LOGIN_TIME = getTime();
			log.login(user);
			// console.log("Logged in @ " + LOGIN_TIME);
			await waitFor(randomTime(5500, 3500));
		} catch (e) {
			throw {
				reason: "Failed log to database that user logged in",
				ip: ipaddress,
				description: e,
				user: user,
			};
		}

		let allAlbumsRandom;

		try {
			allAlbumsRandom = await db.getAllAlbumsRandomOrder();
			await waitFor(randomTime(2000, 1000));
		} catch (e) {
			throw {
				reason: "Failed to get all albums from database in random order",
				ip: ipaddress,
				description: e,
				user: user,
			};
		}
		try {
			await playAllRandomAlbums(driver, allAlbumsRandom, user);
		} catch (e) {
			console.log("error plaing albums");
			console.log(e);
		}

		try {
			await logout(driver);
			log.logout(user);
			console.log("Logged out");
		} catch (e) {
			throw {
				reason: "Issue logging user out ",
				ip: ipaddress,
				description: e,
				user: user,
				album: album.url,
			};
		}
	} catch (e) {
		await log.error(e);
	} finally {
		await waitFor(7000);
		if (driver) {
			await driver.close();
		}
	}
}

const playAllRandomAlbums = (driver, albums, user) => {
	return new Promise((resolve, reject) => {
		asyncForEach(albums, async (albumToPlay) => {
			console.log("About to openAlbum: " + albumToPlay.url);
			try {
				await openAlbum(driver, albumToPlay.url);
				console.log("Opened Album Page");
			} catch (e) {
				throw {
					reason: "Failed to browse to album on spotify webplayer",
					ip: ipaddress,
					description: e,
					user: user,
					album: album.url,
				};
			}

			try {
				console.log("About to playAlbum:  " + albumToPlay.url);
				await playAlbum(driver);
				console.log("Started Playing Album");
				await waitFor(randomTime(5000, 4000));
			} catch (e) {
				throw {
					reason: "Failed to start playing album",
					ip: ipaddress,
					description: e,
					user: user,
					album: album.url,
				};
			}

			try {
				await ensureShuffleOn(driver);
				console.log("Turned Shuffle On");
				await waitFor(randomTime(2000, 1000));
			} catch (e) {
				throw {
					reason: "Failed to click shuffle button",
					ip: ipaddress,
					description: e,
					user: user,
					album: album.url,
				};
			}

			try {
				await goToNextTrack(driver);
				await waitFor(1000, 900);
			} catch (e) {
				throw {
					reason: "Failed to click next track button",
					ip: ipaddress,
					description: e,
					user: user,
					album: album.url,
				};
			}

			try {
				await playAlbumThrough(driver, albumToPlay);
				console.log("Letting album play");
			} catch (e) {
				throw {
					reason: "Issue letting album shuffle play ",
					ip: ipaddress,
					description: e,
					user: user,
					album: albumToPlay.url,
				};
			}
		}).then(() => {
			resolve();
		});
	});
};

const playAlbumThrough = async (driver, album) => {
	let currentSong = "";
	const time = randomTime(540000, 490000);
	const delay = 30000;
	const numberOfTimes = Math.floor(time / delay);
	let arr = [];
	for (i = 0; i < numberOfTimes; i++) {
		arr.push(i);
	}
	console.log(arr);
	return new Promise((resolve, reject) => {
		asyncForEach(arr, async (a) => {
			await waitFor(29000);
			getCurrentPlayingSong(driver)
				.then((song) => {
					if (song !== currentSong) {
						db.incrementAlbum(album, ipaddress).then(() => {
							currentSong = song;
						});
					}
				})
				.catch(() => reject());
		}).then(() => {
			resolve();
		});
	});
};
const getCurrentPlayingSong = (driver) => {
	console.log("Trying to get current playing song");
	const xpath =
		"/html/body/div[3]/div/div[3]/div[3]/footer/div[1]/div[1]/div/div[2]/div[1]/div/span/a";
	const classLabel = "now-playing";
	return new Promise((resolve, reject) => {
		driver
			.findElements(By.className(classLabel))
			.then((elements) => {
				elements[0].getAttribute("aria-label").then((song) => {
					console.log(song);
					let str = song.split(":")[1];
					const name = str.substring(1);
					console.log(name);
					resolve(name);
				});
			})
			.catch(() => reject());
	});
};

const asyncForEach = async (array, callback) => {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
};
const start = async () => {
	await main();
	start();
};
const setOptions = () => {
	const options = new chrome.Options();
	options.setUserPreferences({
		"profile.default_content_setting_values.notifications": 2,
	});
	// options.addArguments("--no-sandbox");
	// options.addArguments("-disable-dev-shm-usage");
	// options.addArguments("--headless");
	return options;
};
const createDriver = (options) => {
	return new Promise((resolve) => {
		resolve(
			new Builder().forBrowser("chrome").setChromeOptions(options).build()
		);
	});
};
const openSite = (driver) => {
	return new Promise((resolve) => {
		driver.get("https://open.spotify.com/browse/featured").then(resolve());
	});
};
const openAlbum = (driver, album) => {
	return new Promise((resolve) => {
		driver.get(album).then(resolve());
	});
};
const openLoginScreen = (driver) => {
	return new Promise((resolve) => {
		driver
			.wait(
				until.elementLocated(
					By.className(
						"_2221af4e93029bedeab751d04fab4b8b-scss _1edf52628d509e6baded2387f6267588-scss"
					)
				)
			)
			.then(() => {
				console.log("Found Login Button");
				driver
					.findElement(
						By.className(
							"_2221af4e93029bedeab751d04fab4b8b-scss _1edf52628d509e6baded2387f6267588-scss"
						)
					)
					.click();
			})
			.then(() => {
				resolve();
			});
	});
};
const login = async (driver, user) => {
	return new Promise(async (resolve, reject) => {
		await waitFor(randomTime(2000, 1500));
		await driver.findElement(By.className("control-indicator")).click();
		await waitFor(randomTime(1000, 500));
		await driver.wait(until.elementLocated(By.id("login-username")));
		for (let i = 0; i < user.email.length; i++) {
			await waitFor(randomTime(50, 10));
			await driver.findElement(By.id("login-username")).sendKeys(user.email[i]);
		}
		await waitFor(randomTime(200, 100));
		for (let i = 0; i < user.password.length; i++) {
			await waitFor(randomTime(50, 10));
			await driver
				.findElement(By.id("login-password"))
				.sendKeys(user.password[i]);
		}
		await waitFor(randomTime(1500, 1000));
		await driver.findElement(By.id("login-button")).click();
		await waitFor(randomTime(2000, 1000));
		const error = await driver.findElements(By.className("alert-warning"));
		if (error.length > 0) {
			reject("bad login");
		} else {
			resolve();
		}
	});
};
const getTime = () => {
	let log = new Date();
	return log.toUTCString();
};
const getRandomAlbum = () => {
	const totalAlbums = data.albums.length;
	const randomIndex = randomTime(totalAlbums, 0);
	return data.albums[randomIndex];
};
const logout = async (driver) => {
	const profilePath =
		"/html/body/div[3]/div/div[3]/div[1]/header/div[4]/button";
	const actions = await driver.findElements(By.xpath(profilePath));
	await waitFor(randomTime(3500, 2000));
	const actionIndex = 2;
	actions.forEach((element, index) => {
		if (index === actionIndex) {
			element.click();
		}
	});
};

const getTotalTimePlayed = (driver) => {
	const path =
		"/html/body/div[3]/div/div[3]/div[3]/footer/div/div[2]/div/div[2]/div[1]";
	return new Promise((resolve) => {
		driver.findElements(By.xpath(path)).then((elements) => {
			elements[0].getText().then((time) => resolve(time));
		});
	});
};
const getSongName = (driver) => {
	const path =
		"/html/body/div[3]/div/div[3]/div[3]/footer/div/div[1]/div/div[2]/div[1]/div/span/a";
	return new Promise((resolve) => {
		driver.findElements(By.xpath(path)).then((elements) => {
			elements[0].getText().then((name) => resolve(name));
		});
	});
};
const getArtist = (driver) => {
	const path =
		"/html/body/div[3]/div/div[3]/div[3]/footer/div/div[1]/div/div[2]/div[2]/span/span/span/a";
	return new Promise((resolve) => {
		driver.findElements(By.xpath(path)).then((elements) => {
			elements[0].getText().then((name) => resolve(name));
		});
	});
};

const playAlbum = (driver) => {
	return new Promise((resolve, reject) => {
		driver
			.wait(
				until.elementLocated(
					By.xpath(
						"/html/body/div[4]/div/div[3]/div[4]/div[1]/div/div[2]/section[1]/div[3]/div/button[1]"
					)
				)
			)
			.then(() => {
				console.log("Play Button Found");
				driver
					.findElement(
						By.xpath(
							"/html/body/div[4]/div/div[3]/div[4]/div[1]/div/div[2]/section[1]/div[3]/div/button[1]"
						)
					)
					.click();
			})
			.then(() => {
				console.log("Play Button Clicked");
				resolve();
			})
			.catch(() => reject());
	});
};
const ensureShuffleOn = (driver) => {
	const classNoShuffle = "control-button spoticon-shuffle-16";
	const classShuffle =
		"control-button spoticon-shuffle-16 control-button--active";
	return new Promise((resolve) => {
		driver.findElements(By.className(classShuffle)).then((elements) => {
			if (elements.length === 0) {
				driver.findElement(By.className(classNoShuffle)).then((element) => {
					element.click();
					resolve();
				});
			} else {
				resolve();
			}
		});
	});
};
const goToNextTrack = (driver) => {
	const nextTrackPath =
		"/html/body/div[4]/div/div[3]/div[3]/footer/div/div[2]/div/div[1]/div[4]/button";
	console.log("trying to play next track");
	const nextTrackClass = "spoticon-skip-forward-16";
	return new Promise((resolve, reject) => {
		driver
			.findElements(By.className(nextTrackClass))
			.then((elements) => {
				elements[0].click();
				console.log("next track clicked");
				resolve();
			})
			.catch(() => reject());
	});
};

const getAlbumName = (driver) => {
	const xpath =
		"/html/body/div[3]/div/div[3]/div[4]/div[1]/div/div[2]/section[1]/div[1]/div[5]/span/h1";
	return new Promise((resolve) => {
		driver.findElements(By.xpath(xpath)).then((elements) => {
			elements[0].getText().then((name) => resolve(name));
		});
	});
};

class CustomError extends Error {
	constructor(description, code, ...params) {
		super(...params);
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, CustomError);
		}
		this.description = description;
		this.code = code;
		this.date = getTime();
	}
}

module.exports = { start, main };
