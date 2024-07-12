async function notify() {
	const value = document.getElementById('name').value;
	console.log(value);
	const url = new URL("https://sdrl-commentary.gently.org.uk/notify");
	url.searchParams.set('user', value);
	await fetch(url);
}
