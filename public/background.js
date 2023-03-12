var myExtensionState = {
	transcript: ""
};
importScripts("/js/speech")
chrome.runtime.onMessage.addListener((request) => {
	if (request.type === "REQUEST_MICROPHONE_PERMISSION") {
		chrome.tabs.create({ url: chrome.runtime.getURL("options.html") });
	} else if (request.type === "START_LISTENING") {
		console.log("start listening");
		startSpeechRecognition();
	} else if (request.type === "STOP_LISTENING") {
		// stop listening
	} else if (request.type === "GET_TRANSCRIPT") {
		// save the speech to the state
		return myExtensionState.transcript;
	}
});

// Listen for the onSuspend event
chrome.runtime.onSuspend.addListener(function () {
	// Save the extension state
	chrome.storage.local.set({ state: myExtensionState }, function () {
		console.log("Extension state saved");
	});
});

// Listen for the onInstalled event
chrome.runtime.onInstalled.addListener(function () {
	// Restore the extension state
	chrome.storage.local.get(["state"], function (result) {
		if (result.state) {
			myExtensionState = result.state;
			console.log("Extension state restored");
		}
	});
});
