console.log("Hello");

(function() {
	Vue.component("chat-area", {
		props: ["messages"],
		template: `
		<div class="chat-area">
			<ul class="list-group list-group-flush">
				<li v-for="message in messages" class="list-group-item">
					{{ message.msg }}
				</li>
			</ul>
		</div>
		`
	});

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

	const socket = io();

	socket.on("chat-message", message => {
		app.chatMessages.push(message);
	});

	socket.on("chat-history", history => {
		app.chatMessages = history;
	});
})(io, Vue);
