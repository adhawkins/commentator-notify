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

let voices = [];

function say(word) {
	const speak = new SpeechSynthesisUtterance(word);

	let voiceControl = document.getElementById('voice');
	let selectedVoice = voiceControl.options[voiceControl.selectedIndex].text;

	if (selectedVoice && voices.length) {
		const voice = voices.find((voice) => voice.name == selectedVoice);
		if (voice) {
			speak.voice = voice;
		}
	}

	window.speechSynthesis.speak(speak);
}

function voiceChanged() {
	let voiceControl = document.getElementById('voice');
	let selectedVoice = voiceControl.options[voiceControl.selectedIndex].text;

	const url = new URL(window.location);
	url.searchParams.set('voice', selectedVoice);

	let urlControl = document.getElementById('url');
	const newA = document.createElement('a');
	newA.setAttribute('href', url.href);
	newA.innerHTML = url.href;
	urlControl.innerHTML = "";
	urlControl.appendChild(newA);

}

function loadVoices() {
	voices = window.speechSynthesis.getVoices();

	if (voices.length) {
		let voiceControl = document.getElementById('voice');

		while (voiceControl.options.length > 0) {
			voiceControl.remove(0);
		}

		const url = new URL(window.location);
		const selectedVoice = url.searchParams.get('voice');
		voices.forEach((voice) => {
			if (voice.lang == "en-GB") {
				const newOption = new Option(voice.name)

				if (selectedVoice && selectedVoice == voice.name) {
					newOption.selected = true;
				}

				voiceControl.add(newOption);
			}
		});

		voiceChanged();
	}
}

if ("onvoiceschanged" in window.speechSynthesis) {
	window.speechSynthesis.onvoiceschanged = loadVoices;
} else {
	loadVoices();
}

connectWS();
