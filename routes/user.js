const uid2 = require("uid2"); // Package for creating random strings
const SHA256 = require("crypto-js/sha256"); // Used to encript a string
const encBase64 = require("crypto-js/enc-base64"); // Transforms encryption into string

const express = require("express");
const router = express.Router();

const User = require("../models/User");

router.post("/user/signup", async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email) {
			//   console.log("ok");
			return res.status(400).json({ message: "Missing parameter" });
		}

		const userAlreadyInDb = await User.findOne({ email: email });
		// console.log(userAlreadyInDb);

		if (userAlreadyInDb) {
			return res.status(409).json({ message: "This email is already used" });
		}

		// console.log(req.body);

		// generate a salt
		const salt = uid2(16);
		// generate a hash
		const hash = SHA256(req.body.password + salt).toString(encBase64);
		// generate a token
		const token = uid2(64);

		const newUser = new User({
			email: req.body.email,
			password: req.body.password,
			salt: salt,
			hash: hash,
			token: token,
		});
		await newUser.save();
		res.status(201).json({
			_id: newUser._id,
			token: newUser.token,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.post("/user/login", async (req, res) => {
	try {
		// search the DB for a user whose email address matches the one received

		const { email, password } = req.body;

		const user = await User.findOne({ email: req.body.email });

		if (user === null) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		console.log(user);

		const newHash = SHA256(user.salt + req.body.password).toString(encBase64);

		if (newHash !== user.hash) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		res.json({
			_id: user._id,
			token: user.token,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

module.exports = router;
