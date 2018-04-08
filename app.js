const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const PORT = 3000;

app.use(express.static("static"));

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

io.on("connection", socket => {
	console.log("A client connected");
});

http.listen(PORT, () => {
	console.log("Listening on port", PORT);
});
