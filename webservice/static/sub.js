async function notify() {
	const value = document.getElementById('name').value;
	console.log(value);
	const url = new URL(document.location);
	url.pathname = "/notify";
	url.searchParams.set('user', value);
	await fetch(url);
}
