import react from "react";
import { useSelector } from "react-redux";

const Output = () => {
	const results = useSelector((state: any) => state.recording.results);
	const out = results.length > 0 ? results[0] : "";
	return (
		<div className="output">
			<h1>{out}</h1>
		</div>
	);
};

export default Output;
