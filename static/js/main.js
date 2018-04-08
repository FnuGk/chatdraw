console.log("Hello");

(function() {
	const socket = io();

	var app = new Vue({
		el: "#app",
		data: {
			message: "",
			chatMessages: []
		},
		methods: {
			sendMessage: () => {
				const message = { msg: app.message };
				app.chatMessages.push(message);
				socket.emit("chat-message", message);
				app.message = "";
			}
		}
	});

	socket.on("chat-message", message => {
		app.chatMessages.push(message);
	});

	socket.on("chat-history", history => {
		app.chatMessages = history;
	});
})(io, Vue);
