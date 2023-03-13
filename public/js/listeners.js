// create evene listener for .start-btn and .stop-btn
const startBtn = document.querySelector(".start-btn");
const stopBtn = document.querySelector(".stop-btn");

// create event listener for .start-btn
startBtn.addEventListener("click", () => {
	console.log("start button clicked");
	chrome.runtime.sendMessage({ action: "START_ANALYZER" }, function (response) {
		console.log(response);
	});
});

stopBtn.addEventListener("click", () => {
	console.log("stop button clicked");
	chrome.runtime.sendMessage({ action: "STOP_ANALYZER" }, function (response) {
		console.log(response);
	});
});
