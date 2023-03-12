/*global chrome*/

import React, { useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import { useState } from "react";
import { useRef } from "react";

// import uuid generator
import { v4 as uuidv4 } from "uuid";

// import { WaveformAudioRecorder, WaveformAudioRecorderType } from "waveform-audio-recorder";
import { ReactMediaRecorder } from "react-media-recorder";

const RecordView = () => {
	const [transcript, setTranscript] = useState("");
	return (
		<div>
			<ReactMediaRecorder
				render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
					<div>
						<p>{status}</p>
						<button onClick={startRecording}>Start Recording</button>
						<button onClick={stopRecording}>Stop Recording</button>
						<audio src={mediaBlobUrl} controls autoPlay loop />
					</div>
				)}
				onStart={() => console.log("onStart")}
				onStop={(blobUrl) => {
					fetch(blobUrl)
						.then((response) => response.blob())
						.then((blob) => {
							console.log("blob: ", blob);
							const file = new File([blob], "test.wav", { type: "audio/wav" });
							const formData = new FormData();
							formData.append("audio", file);
							fetch("https://c757-122-162-34-202.in.ngrok.io/record", {
								method: "POST",
								body: formData
							})
								.then((response) => response.json())
								.then((data) => {
									console.log("Success:", data);
								})
								.catch((error) => {
									console.error("Error:", error);
								});
						});
				}}
			/>
		</div>
	);
};
// import chrome from
const Dictaphone = () => {
	const mediaRecorderRef = useRef(null);
	const [uniqueRecordId, setUniqueRecordId] = useState(null);
	// const [mediaRecorder, setMediaRecorder] = useState(null);
	useEffect(() => {
		async function getMedia() {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			let mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
			mediaRecorderRef.current = mediaRecorder;
		}
		getMedia();
	}, [mediaRecorderRef]);
	const [chunks, setChunks] = useState([]);
	// let socket = new WebSocket("ws://localhost:8000/ws");
	// socket.addEventListener("open", (event) => {
	// 	console.log("WebSocket connection established");
	// });
	// // on message received
	// socket.addEventListener("message", (event) => {
	// 	console.log("Message from server ", event.data);
	// });

	const startRecordingSocket = async () => {
		const id = uuidv4();
		setUniqueRecordId(id);
		const mediaRecorder = mediaRecorderRef.current;
		mediaRecorder.start(10000);
		mediaRecorder.addEventListener("dataavailable", (event) => {
			chunks.push(event.data);
			const data = event.data;
			const reader = new FileReader();
			reader.readAsArrayBuffer(data);
			reader.onload = () => {
				const arrayBuffer = reader.result;
				// socket.send(arrayBuffer);
			};
			// send to
		});
		mediaRecorder.addEventListener("stop", () => {
			const blob = new Blob(chunks, { type: "audio/webm" });
			const file = new File([blob], "test.wav", { type: "audio/wav" });
			const formData = new FormData();
			formData.append("audio", file);
			formData.append(
				"formData",
				JSON.stringify({
					uuid: "test123",
					rid: id
				})
			);
			fetch("http://localhost:8000/record", {
				method: "POST",
				body: formData
			})
				.then((response) => response.json())
				.then((data) => {
					console.log("Success:", data);
					// empty chunks
					setChunks([]);
				})
				.catch((error) => {
					console.error("Error:", error);
				});
		});
	};
	const stopRecordingSocket = async () => {
		const mediaRecorder = mediaRecorderRef.current;
		mediaRecorder.stop();
	};

	return (
		<div style={{ width: "500px", height: "auto" }}>
			{/* <RecordView /> */}

			{/* <p>Microphone: {listening ? "on" : "off"}</p> */}
			<Button
				onClick={() => {
					const newURL = "./index.html";
					startRecordingSocket();
				}}
				variant="text">
				Start
			</Button>
			<Button
				onClick={() => {
					stopRecordingSocket();
				}}
				variant="text">
				STOP
			</Button>
			{/*<Button onClick={resetTranscript} variant="text">
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
			</Collapse> */}

			{/* <p>TRANSCRIPT: {transcript}</p> */}
		</div>
	);
};
export default Dictaphone;
