import React from "react";
import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Dictaphone from "./components/Dictaphone";
import { IconButton } from "@mui/material";
import Settings from "@mui/icons-material/Settings";
function App() {
	return (
		<div className="App">
			<IconButton
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
