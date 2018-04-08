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
		drawCircle = (ctx, color, x, y, size) => {
			// x -= size;
			// y -= size * 2;

			ctx.beginPath();
			ctx.fillStyle = color;
			ctx.arc(x, y, size, 0, 2 * Math.PI);
			ctx.fill();
		};

		const c = document.getElementById("game");
		c.width = 800; // TODO set these dynamically
		c.height = 600;

		let lastPos = null;

		isDrawing = false;
		c.onmousedown = e => {
			isDrawing = true;
			drawCircle(ctx, "black", e.clientX, e.clientY, 5);
			socket.emit("draw", { x: e.clientX, y: e.clientY });
		};
		c.onmouseup = () => {
			isDrawing = false;
			lastPos = null;
		};
		c.onmouseleave = c.onmouseup;
		c.onmousemove = e => {
			if (!isDrawing) return;
			const x = e.clientX;
			const y = e.clientY;

			socket.emit("draw", { x: x, y: y });
			drawCircle(ctx, "black", x, y, 5);

			// if (lastPos == null) {
			// drawCircle(ctx, "black", x, y, 5);
			// } else {
			// 	console.log(lastPos, x, y);
			// 	ctx.beginPath();
			// 	ctx.fillStyle = "black";
			// 	ctx.moveTo(lastPos.x, lastPos.y);
			// 	ctx.lineWidth = 15;
			// 	ctx.lineTo(x, y);
			// 	ctx.stroke();
			// }

			lastPos = { x: x, y: y };
		};

		const ctx = c.getContext("2d");

		socket.on("draw", point => {
			drawCircle(ctx, "black", point.x, point.y, 5);
		});
	})();
})(io, Vue);
