
// get speech recognition in service worker

// add EventListener to service worker

// add EventListener to content script

const startSpeechRecognition = () => {

    const speechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new speechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.start();
    recognition.onresult = (event) => {
        const last = event.results.length - 1;
        const command = event.results[last][0].transcript;
        console.log('Confidence: ' + event.results[0][0].confidence);
        console.log('Command: ' + command);
        // do something with the command
    }
};