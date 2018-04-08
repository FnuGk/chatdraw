console.log("Hello");

(function() {
	const socket = io();

	var app = new Vue({
		el: "#app",
		data: {
			message: "Hello from vue"
		}
	});
})(io, Vue);
