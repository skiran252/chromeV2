import {
	STOP_RECORDING,
	START_RECORDING,
	STORE_TRANSCRIPT,
	STORE_RESULTS,
	STARTED_INFERENCING,
	STOPPED_INFERENCING
} from "./actions";
import { combineReducers } from "redux";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
	isRecording: false,
	transcript: "",
	results: [],
	isInferencing: false
};
type Action = {
	type: string;
	payload: any;
};

// async thunk
export const uploadBlob = createAsyncThunk("audio/upload", async (data: any, thunkAPI) => {
	thunkAPI.dispatch({ type: STARTED_INFERENCING, payload: data.transcript });
	// store blob in webm format
	const blob = new File([data.blob], "audio.webm", { type: "audio/webm" });
	const file = new File([blob], "audio.wav", { type: "audio/wav" });
	const formData = new FormData();
	formData.append("audioFile", file);
	formData.append("requestData", JSON.stringify({ rid: data.recordId, uuid: data.uuid }));
	axios
		.post("http://35.226.246.252:8000/record", formData, {
			headers: {
				"Content-Type": "multipart/form-data"
			}
		})
		.then((res) => {
			thunkAPI.dispatch({ type: STORE_RESULTS, payload: res.data });
			thunkAPI.dispatch({ type: STOPPED_INFERENCING, payload: data.transcript });
		})
		.catch((err) => {
			console.log("axios err", err);
		});
});
const recordingReducer = (state = initialState, action: Action) => {
	switch (action.type) {
		case START_RECORDING:
			return {
				...state,
				isRecording: true
			};
		case STOP_RECORDING:
			return {
				...state,
				isRecording: false
			};
		case STORE_TRANSCRIPT:
			return {
				...state,
				transcript: action.payload
			};
		case STORE_RESULTS:
			// apppend to results
			console.log("STORE_RESULTS", action.payload);
			return {
				...state,
				results: [...state.results, action.payload]
			};
		case STARTED_INFERENCING:
			return {
				...state,
				isInferencing: true
			};
		case STOPPED_INFERENCING:
			return {
				...state,
				isInferencing: false
			};
		default:
			return state;
	}
};

const rootReducer = combineReducers({
	recording: recordingReducer
	// Add other reducers as needed
});

export default rootReducer;
