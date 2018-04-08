console.log("Hello");

(function() {
	Vue.component("chat-area", {
		props: ["messages"],
		template: `
		<div class="chat-area">
			<ul class="list-group list-group-flush">
				<li v-for="message in messages" class="list-group-item">
					<strong>{{ message.user }}</strong>
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
			userName: "me",
			message: "",
			chatMessages: []
		},
		methods: {
			sendMessage: () => {
				const message = { user: app.userName, msg: app.message };
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

	(function() {
		const c = document.getElementById("game");
		c.width = 800; // TODO set these dynamically
		c.height = 600;

		const drawMoveTo = point => {
			ctx.lineWidth = 10;
			ctx.lineJoin = ctx.lineCap = "round";
			ctx.moveTo(point.x, point.y);
		};

		let isDrawing = false;
		c.onmousedown = e => {
			isDrawing = true;
			const point = { x: e.clientX, y: e.clientY };
			drawMoveTo(point);
			socket.emit("draw-moveTo", point);
		};
		socket.on("draw-moveTo", drawMoveTo);
		c.onmouseup = () => {
			isDrawing = false;
		};

		const drawLineTo = point => {
			ctx.lineTo(point.x, point.y);
			ctx.stroke();
		};
		c.onmousemove = e => {
			if (!isDrawing) return;
			const point = { x: e.clientX, y: e.clientY };

			drawLineTo(point);
			socket.emit("draw-lineTo", point);
		};
		socket.on("draw-lineTo", drawLineTo);

		const ctx = c.getContext("2d");

		socket.on("draw", point => {
			drawCircle(ctx, "black", point.x, point.y, 5);
		});
	})();
})(io, Vue);
