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

	Vue.component("chat-send-form", {
		props: ["send", "value"],
		template: `
		<form @submit="send" action="#">
			<div class="input-group chat-input">
				<input :value="value" v-on:input="$emit('input', $event.target.value)" spellcheck="true" autocomplete="off" class="form-control" aria-label="Message">
				<button class="btn btn-primary" type="submit">Send</button>
			</div>
		</form>
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
