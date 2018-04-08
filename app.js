const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const PORT = 3000;

app.use(express.static("static"));

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

var chatHistory = [
	{ user: "Player1", msg: "Test message 1" },
	{ user: "Gamer", msg: "some other message" }
];

io.on("connection", socket => {
	console.log("A client connected");

	socket.on("chat-message", msg => {
		socket.broadcast.emit("chat-message", msg);
		chatHistory.push(msg);
	});

	socket.on("draw", point => {
		socket.broadcast.emit("draw", point);
	});

	socket.emit("chat-history", chatHistory);
});

http.listen(PORT, () => {
	console.log("Listening on port", PORT);
});
