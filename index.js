require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const serverRoutes = require("./routes/server");

app.use(serverRoutes);

app.all("*", (req, res) => {
	res.status(404).json({ message: "Not Found" });
});

app.listen(process.env.PORT, () => {
	console.log("Server started");
});
