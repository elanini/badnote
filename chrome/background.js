chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log(request);
	var xhr = new XMLHttpRequest();
	xhr.addEventListener("load", function() {
		console.log(this.responseText);
		sendResponse(JSON.parse(this.responseText));
	});
	xhr.open(request.type, request.address);
	xhr.send();
	return true;
});