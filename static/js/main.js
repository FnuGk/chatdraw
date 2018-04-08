console.log("Hello");

(function() {
	const socket = io();

	var app = new Vue({
		el: "#app",
		data: {
			message: "Hello from vue",
			chatMessages: []
		}
	});

	socket.on("chat-history", history => {
		app.chatMessages = history;
	});
})(io, Vue);
