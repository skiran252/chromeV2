/*global chrome*/
import { uploadBlob } from "../redux/reducers";
import { useRef } from "react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import { v4 as uuidv4 } from "uuid";
import React from "react";
const Recorder = () => {
	const dispatch = useDispatch();
	const mediaRecorderRef = useRef(null);
	const [uniqueRecordId, setUniqueRecordId] = useState("");
	const [chunks, setChunks] = useState([]);
	const [startTime, setStartTime] = useState(null);
	const [recording, setRecording] = useState(false);
	useEffect(() => {
		async function getMedia() {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			let mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
			mediaRecorderRef.current = mediaRecorder;
		}
		getMedia();
		// startRecording();
	}, [mediaRecorderRef]);
    let startTimeObj = null;
	const startRecording = async () => {
		setStartTime(new Date());
        startTimeObj = new Date();
		// ckear chunks
		setChunks([]);
		// uuid
		const uuid = uuidv4();
		setUniqueRecordId(uuid);
		if (mediaRecorderRef === null) {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			let mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
			mediaRecorderRef.current = mediaRecorder;
		}
		const mediaRecorder = mediaRecorderRef.current;
		setRecording(true);
		mediaRecorder.start();
		console.log("mediaRecorder", mediaRecorder);
		mediaRecorder.addEventListener("dataavailable", (event) => {
			chunks.push(event.data);
		});
		mediaRecorder.addEventListener("stop", (event) => {
			// print duration from starttime
			const endTime = new Date();
			const duration = (endTime.getTime() - startTimeObj.getTime()) / 1000;
			console.log("duration", duration);
			dispatch(
				uploadBlob({
					blob: chunks[0],
					recordId: uniqueRecordId,
					duration: duration
				})
			);
		});
	};
	const stopRecording = async () => {
		setRecording(false);
		console.log("mediaRecorderRef", mediaRecorderRef.current);
		const mediaRecorder = mediaRecorderRef.current;
		mediaRecorder.stop();
	};
	return (
		<div className="button-group">
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
