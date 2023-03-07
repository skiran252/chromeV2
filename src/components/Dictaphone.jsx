/*global chrome*/

import React from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import { useState } from "react";
const speechModule = require("react-speech-recognition");
// import chrome from
const Dictaphone = () => {
	const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
	var userLang = navigator.language || navigator.userLanguage;
	if (!browserSupportsSpeechRecognition) {
		return <span>Browser doesn't support speech recognition.</span>;
	}

	setInterval(() => {
		console.log("transcript: ", transcript);
	}, 30000);
	async function requestMicrophonePermission() {
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		console.log("stream: ", stream);
	}

	return (
		<div style={{ width: "500px", height: "auto" }}>
			<p>Microphone: {listening ? "on" : "off"}</p>
			<Button
				onClick={() => {
					console.log("userLang: ", userLang);
					requestMicrophonePermission();
					SpeechRecognition.startListening({ continuous: true, language: userLang });
				}}
				variant="text">
				Start
			</Button>
			<Button onClick={SpeechRecognition.stopListening} variant="text">
				Stop
			</Button>
			<Button onClick={resetTranscript} variant="text">
				RESET
			</Button>
			<Collapse in={listening}>
				<p>Listening...</p>
				<div style={{ padding: "10px", width: "100%" }}>
					<TextField
						multiline
						maxRows={20}
						id="outlined-basic"
						label="Transcript"
						variant="outlined"
						value={transcript}
					/>
				</div>
			</Collapse>

			{/* <p>TRANSCRIPT: {transcript}</p> */}
		</div>
	);
};
export default Dictaphone;
