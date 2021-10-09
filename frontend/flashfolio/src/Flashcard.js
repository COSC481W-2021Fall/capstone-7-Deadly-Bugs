import React, {useState, useRef, useEffect} from 'react'
import './Flashcard.css'

export default function Flashcard({flashcard, editMode=false}) {

	const [flip, setFlip] = useState(false);
	const [showEditor, setShowEditor] = useState(false);	

	const currentSide = () => flip ? flashcard.BackSide : flashcard.FrontSide;

	const editor = useRef(null);
	const [editVal, setEditVal] = useState("");

	const updateCard = () => {
		console.log("updated!!!");
		setEditVal(editor.current.value);
		if (flip) {
			flashcard.BackSide = editor.current.value;
		} else {
			flashcard.FrontSide = editor.current.value;
		}
	}

	const cardContents = () => {
		if (!editMode || !showEditor) {
			return currentSide();
		} else {
			return (
				<textarea className="cardEditor" onChange={updateCard}
					value={editVal} ref={editor} />
			)
		}
	}

	const flipCard = () => {
		/* This is very ugly and will need to be cleaned up */
		if (showEditor) {
			setEditVal(!flip ? flashcard.BackSide : flashcard.FrontSide);
		}
		setFlip(!flip)
	}

	const cardClick = () => !editMode || !showEditor ? flipCard() : "";

	const editCard = () => {
		if (!showEditor) {
			setEditVal(currentSide());
		}
		setShowEditor(!showEditor);
	}

	/* If the flashcard changes to a different one, update the editor */
	useEffect(() => {
		setEditVal(currentSide());
	}, [flashcard]);

	return (
		<div>
		{editMode ? 
			<button onClick={editCard}>
				{showEditor ? "Done" : "Edit Card"} 
			</button>:""}
		<button onClick={flipCard}>
			Flip
		</button>
		<div onClick={cardClick} class="card">
			{cardContents()}
		</div>
		</div>
	)
}
