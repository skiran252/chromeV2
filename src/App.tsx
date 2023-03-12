import React from "react";
import "./App.css";
import Dictaphone from "./components/Dictaphone";
import { IconButton } from "@mui/material";
import Settings from "@mui/icons-material/Settings";
function App() {
	return (
		<div className="App">
			<IconButton className="settings-icon"
				onClick={() => {
					chrome.runtime.openOptionsPage();
				}}>
				<Settings />
			</IconButton>
			<Dictaphone></Dictaphone>
		</div>
	);
}

export default App;
