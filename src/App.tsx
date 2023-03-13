import React from "react";
import "./App.css";
import { IconButton } from "@mui/material";
import Settings from "@mui/icons-material/Settings";
import { Provider } from "react-redux";
import store from "./redux/store";
import Recorder from "./components/Recorder";
import Output from "./components/output";
function App() {
	return (
		<Provider store={store}>
			<div className="App">
				<IconButton
					className="settings-icon"
					onClick={() => {
						chrome.runtime.openOptionsPage();
					}}>
					<Settings />
				</IconButton>
				<Recorder></Recorder>
				<Output></Output>
			</div>
		</Provider>
	);
}

export default App;
