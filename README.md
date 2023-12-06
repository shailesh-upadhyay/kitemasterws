# The Kite Master Client Websocket

Client Websocket package for connection to Master kite websocket. Includes subscription and unsubscription of tokens to get data from master ws which gets communicated to kite and sends data downstream.

## Requirements

- NodeJS v8.0.0+

## Installation

Install via [npm](https://www.npmjs.com/package/kitemasterws)

    npm install kitemasterws

## Getting started WebSocket client

```javascript
const MasterWsClient = require("./masterWsClient");

const wsClient = new MasterWsClient(MASTER_WS_URL, botName);

wsClient.on("subscribe", subscribe);
wsClient.on("ticks", onTicks);

function subscribe() {
	wsClient.subscribe(tokens);
}

function unsubscribe(tokensArr) {
	wsClient.unsubscribe(tokensArr);
}

function onTicks(ticks) {
	for (const tick of ticks) {
    // tick data handling
	}
}
```

## Author

[Github](https://github.com/shailesh-upadhyay)

