const WebSocket = require("ws");

class MasterWsClient {
	constructor(url, botName, maxReconnectAttempts = 5, reconnectDelay = 5000) {
		this.url = url;
		this.maxReconnectAttempts = maxReconnectAttempts;
		this.reconnectAttempts = 0;
		this.reconnectDelay = reconnectDelay;
		this.botName = botName;
		this.connect();
	}

	connect() {
		this.ws = new WebSocket(this.url);

		this.ws.onmessage = (event) => {
			this.handleMessage(event.data);
		};

		this.ws.onopen = () => {
			this.handleOpen();
		};

		this.ws.onclose = (event) => {
			this.handleClose(event);
		};

		this.ws.onerror = (error) => {
			this.handleError(error);
		};

		this.events = {};
	}

	handleOpen() {
		console.log("Connected to master ws server");
		if (this.events.subscribe) {
			this.events.subscribe();
		}
	}

	handleClose() {
		console.log("Disconnected from master ws server");
	}

	handleMessage(data) {
		if (this.events.ticks) {
			this.events.ticks(JSON.parse(data));
		}
	}

	handleError(error) {
		console.error("WebSocket connection error:", error);
		this.reconnect();
	}

	reconnect() {
		if (this.reconnectAttempts < this.maxReconnectAttempts) {
			console.log(
				`Attempting to reconnect (attempt ${this.reconnectAttempts + 1}/${
					this.maxReconnectAttempts
				})...`
			);
			setTimeout(() => {
				this.connect();
			}, this.reconnectDelay);
			this.reconnectAttempts++;
		} else {
			console.error("Max reconnect attempts reached. Unable to reconnect.");
		}
	}

	subscribe(tokens) {
		const subscriptionMessage = {
			type: "subscribe",
			botName: this.botName,
			tokens: tokens,
		};

		this.ws.send(JSON.stringify(subscriptionMessage));
	}

	unsubscribe(tokens) {
		const unsubscriptionMessage = {
			type: "unsubscribe",
			botName: this.botName,
			tokens: tokens,
		};

		this.ws.send(JSON.stringify(unsubscriptionMessage));
	}

	// Custom event handling methods

	on(eventName, callback) {
		if (eventName === "ticks") {
			this.events.ticks = callback;
		} else if (eventName === "subscribe") {
			this.events.subscribe = callback;
		}
	}
}

module.exports = MasterWsClient;
