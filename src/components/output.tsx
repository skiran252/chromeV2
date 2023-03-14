import react from "react";
import { useSelector } from "react-redux";
import { FlashcardArray } from "react-quizlet-flashcard";
import { strict } from "assert";

const Output = () => {
	const results = useSelector((state: any) => state.recording.results);
	const isInferencing = useSelector((state: any) => state.recording.isInferencing);
	const out: string = results.length > 0 ? results[0] : "";
	const cards = [
		{
			id: 1,
			front: "What is the capital of <u>Alaska</u>?",
			back: "Juneau",
			frontChild: <div>Hello there</div>,
			backChild: <p>This is a back child</p>
		}
	];
	return (
		<div className="output">
			{isInferencing ? <div className="loader"></div> : null}
			<h1>
				{JSON.stringify(out)}
				{/* 
					// @ts-ignore */}
				<FlashcardArray cards={cards} />
			</h1>
		</div>
	);
};

export default Output;
