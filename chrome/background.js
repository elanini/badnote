chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function() {
        sendResponse(JSON.parse(this.responseText));
    });
    xhr.open(request.type, request.address);
    xhr.send();
    return true;
});