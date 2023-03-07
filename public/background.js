chrome.runtime.onMessage.addListener((request) => {
	if (request.type === "REQUEST_MICROPHONE_PERMISSION") {
		chrome.tabs.create({ url: chrome.runtime.getURL("options.html") });
	}
});
