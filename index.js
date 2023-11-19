require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI);

const serverRoutes = require("./routes/server");
const userRoutes = require("./routes/user");

app.use(serverRoutes);
app.use(userRoutes);

app.all("*", (req, res) => {
	res.status(404).json({ message: "Not Found" });
});

app.listen(process.env.PORT, () => {
	console.log("Server started");
});
