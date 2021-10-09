import React, {useState, useRef, useEffect} from 'react'
import './Flashcard.css'

export default function Flashcard({flashcard, editMode=false}) {

	const [flip, setFlip] = useState(false);
	const [showEditor, setShowEditor] = useState(false);	

	const currentSide = () => flip ? flashcard.BackSide : flashcard.FrontSide;

	const editor = useRef(null);

	const updateCard = () => {
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
					defaultValue={currentSide()} ref={editor} />
			)
		}
	}

	const flipCard = () => {
		setFlip(!flip)
	}

	const cardClick = () => !editMode || !showEditor ? flipCard() : "";

	return (
		<div>
		{editMode ? 
			<button onClick={()=>{setShowEditor(!showEditor)}}>
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
