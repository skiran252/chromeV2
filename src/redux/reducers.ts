import { STOP_RECORDING, START_RECORDING, STORE_TRANSCRIPT, STORE_RESULTS } from "./actions";
import { combineReducers } from "redux";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
	isRecording: false,
	transcript: "",
	results: []
};
type Action = {
	type: string;
	payload: any;
};

// async thunk
export const uploadBlob = createAsyncThunk("audio/upload", async (data: any, thunkAPI) => {
	const file = new File([data.blob], "audio.wav", { type: "audio/wav" });
	const formData = new FormData();
	formData.append("audio", file);
	formData.append("formData", JSON.stringify({ rid: data.recordId }));
	axios
		.post("http://localhost:8000/record", formData, {
			headers: {
				"Content-Type": "multipart/form-data"
			}
		})
		.then((res) => {
			thunkAPI.dispatch({ type: STORE_RESULTS, payload: res.data });
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

		default:
			return state;
	}
};

const rootReducer = combineReducers({
	recording: recordingReducer
	// Add other reducers as needed
});

export default rootReducer;
