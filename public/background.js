var myExtensionState = {
	transcript: ""
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log(request, sender, sendResponse);
	if (request.type === "REQUEST_MICROPHONE_PERMISSION") {
		chrome.tabs.create({ url: chrome.runtime.getURL("options.html") });
	} else if (request.action === "START_ANALYZER") {
		// create bew tav abd kiad wutg ubdex,gtnk and store tab id
		chrome.tabs.create({ url: chrome.runtime.getURL("index.html") }, (tab) => {
			chrome.storage.sync.set({ tabId: tab.id });
		});
	} else if (request.action === "STOP_ANALYZER") {
		// make sure tab id is stored if not exists create a new tab
		chrome.storage.sync.get(["tabId"], (result) => {
			if (result.tabId) {
				chrome.tabs.update(result.tabId, { active: true });
			} else {
				chrome.tabs.create({ url: chrome.runtime.getURL("index.html") }, (tab) => {
					chrome.storage.sync.set({ tabId: tab.id });
				});
			}
		});
	} else if (request.action === "UPDATE_TRANSCRIPT") {
		// update transcript
		myExtensionState.transcript = request.transcript;
	}
	// else if (request.action === "LOAD_RIBBON") {
	// 	// load ribbon
	// 	console.log("load ribbon");
	// 	chrome.tabs.executeScript(sender.tab.id, { code: "addRibbon();" });
	// 	sendResponse({ status: "success", tabId: sender.tab.id });
	// }
});

const addRibbon = () => {
	if (!document.querySelector(".ribbon")) {
		var ribbon = document.createElement("div");
		// this is small right side mirror on middle of right edge with dimension 20px * 20 px
		ribbon.style.backgroundImage = "url('https://i.imgur.com/4ZQ9Z4u.png')";
		ribbon.style.backgroundColor = "blue";
		ribbon.style.backgroundSize = "cover";
		ribbon.style.width = "20px";
		ribbon.style.height = "20px";
		ribbon.style.position = "fixed";
		ribbon.style.top = "50%";
		ribbon.style.right = "0";
		ribbon.style.transform = "translate(0, -50%)";
		ribbon.style.zIndex = "999";
		ribbon.style.cursor = "pointer";
		ribbon.classList.add("ribbon");
		ribbon.addEventListener("click", () => {
			console.log("ribbon clicked");
			chrome.runtime.sendMessage({ action: "STOP_ANALYZER" }, function (response) {
				console.log(response);
			});
		});
		console.log("ribbon added");
		document.body.appendChild(ribbon);
	}
};

// add ribbon to page if it doesn't exist

// add listeners to tabs switch and creation
chrome.tabs.onActivated.addListener(function (activeInfo) {
	chrome.tabs.get(activeInfo.tabId, function (tab) {
		if (tab.url.startsWith("http")) {
			chrome.tabs.executeScript(tab.id, { code: "addRibbon();" });
		}
	});
});

// on tab creation
chrome.tabs.onCreated.addListener(function (tab) {
	if (tab.url.startsWith("http")) {
		chrome.tabs.executeScript(tab.id, { code: "addRibbon();" });
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

function generateUUID() {
	let uuid = "",
		i,
		random;
	for (i = 0; i < 32; i++) {
		random = (Math.random() * 16) | 0;
		if (i == 8 || i == 12 || i == 16 || i == 20) {
			uuid += "-";
		}
		uuid += (i == 12 ? 4 : i == 16 ? (random & 3) | 8 : random).toString(16);
	}
	return uuid;
}

// Get the UUID from storage or generate a new one
chrome.storage.sync.get(["uuid"], function (result) {
	let uuid = result.uuid;
	if (!uuid) {
		uuid = generateUUID();
		chrome.storage.sync.set({ uuid: uuid });
	}
	console.log("UUID: " + uuid);
});
