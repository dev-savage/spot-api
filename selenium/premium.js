const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const randomTime = (max, min) => Math.floor(Math.random() * max + min);
const waitFor = (ms) => new Promise((r) => setTimeout(r, ms));
const db = require("./db.js");
