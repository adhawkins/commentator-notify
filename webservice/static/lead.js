function connectWS() {
	console.log("Connecting")

	const ws = new WebSocket("wss://sdrl-commentary.gently.org.uk/ws")

	ws.onopen = function () {
		console.log("WS connected");
	}

	ws.onclose = function () {
		console.log("WS closed");
		setTimeout(function () { connectWS() }, 10000);
	}

	ws.onmessage = function (event) {
		console.log(`Event: '${JSON.stringify(event.data)}'`);
		say(event.data)
	}
}

function say(word) {
	const speak = new SpeechSynthesisUtterance(word);
	window.speechSynthesis.speak(speak);
}

connectWS();
