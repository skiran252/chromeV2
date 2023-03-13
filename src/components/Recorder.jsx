/*global chrome*/
import { uploadBlob } from "../redux/reducers";
import { useRef } from "react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import { v4 as uuidv4 } from "uuid";

const Recorder = () => {
	const dispatch = useDispatch();
	const mediaRecorderRef = useRef(null);
	const [uniqueRecordId, setUniqueRecordId] = useState(null);
	const [chunks, setChunks] = useState([]);
	const [recording, setRecording] = useState(false);
	const [transcript, setTranscript] = useState("");
	useEffect(() => {
		async function getMedia() {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			let mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
			mediaRecorderRef.current = mediaRecorder;
		}
		getMedia();
	}, [mediaRecorderRef]);
	const addEventListeners = (mediaRecorder) => {
		mediaRecorder.addEventListener("dataavailable", (event) => {
			chunks.push(event.data);
		});
		mediaRecorder.addEventListener("stop", (event) => {
			console.log("stopped");
		});
	};
	const startRecording = async () => {
        // ckear chunks
        setChunks([]);
		setUniqueRecordId(uuidv4());
		const mediaRecorder = mediaRecorderRef.current;
		if (mediaRecorder === null) {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			let mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
			mediaRecorderRef.current = mediaRecorder;
		}
		setRecording(true);
		mediaRecorder.start();
		mediaRecorder.addEventListener("dataavailable", (event) => {
			chunks.push(event.data);
		});
		mediaRecorder.addEventListener("stop", (event) => {
			console.log("stopped", chunks[0]);
			dispatch(
				uploadBlob({
					blob: chunks[0],
					recordId: uniqueRecordId
				})
			);
		});
	};
	const stopRecording = async () => {
		setRecording(false);
		const mediaRecorder = mediaRecorderRef.current;
		mediaRecorder.stop();
	};
	return (
		<div style={{ width: "500px", height: "auto" }}>
			<Button
				onClick={() => {
					const newURL = "./index.html";
					startRecording();
				}}
				disabled={recording}
				variant="text">
				Start
			</Button>
			<Button
				onClick={() => {
					stopRecording();
				}}
				disabled={!recording}
				variant="text">
				STOP
			</Button>
		</div>
	);
};
export default Recorder;
