const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();

const marvelApiUrl = "https://lereacteur-marvel-api.herokuapp.com/";

router.get("/marvel/:endpoint/:id?", async (req, res) => {
	const { endpoint, id } = req.params;
	const { query } = req;

	// Extract skip, limit, and name from the query parameters
	const { skip, limit, name, title } = query;

	try {
		const apiUrl = id
			? `${marvelApiUrl}${endpoint}/${id}`
			: `${marvelApiUrl}${endpoint}`;
		const response = await axios.get(apiUrl, {
			params: {
				...query,
				apiKey: process.env.MARVEL_API_KEY,
				skip,
				limit,
				name,
				title,
			},
		});

		console.log("Marvel API response:", response.data);

		res.json(response.data);
	} catch (error) {
		console.error("Error making request to Marvel API:", error.message);
		res.status(error.response?.status || 500).json({ error: error.message });
	}
});

module.exports = router;
