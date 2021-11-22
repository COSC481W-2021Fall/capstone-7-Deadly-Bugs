import React, { useEffect, useRef, useState } from "react"

/* Styling */
import "./Flashcard.css"


export default function Flashcard({ flashcard, editMode = false, delfunc }) {

	const [flip, setFlip] = useState(false)
	const [showEditor, setShowEditor] = useState(false)

	/* Returns appropriate side according to flip state */
	const currentSide = () => flip ? cardState.BackSide : cardState.FrontSide

	/* Ref for the actual textarea (maybe can be removed?)*/
	const editor = useRef(null)

	/* State for the editor textarea"s value */
	const [editVal, setEditVal] = useState("")

	const [cardState, setCardState] = useState(flashcard)

	/* Executed when editor textarea is changed by user */
	const updateCard = () => {
		/* update editVal to reflect changes */
		setEditVal(editor.current.value)
		/* update actual card to reflect changes */
		if (flip) {
			flashcard.BackSide = editor.current.value
		} else {
			flashcard.FrontSide = editor.current.value
		}
	}

	/* Gets the card divs current contents (View/Edit Mode) */
	const cardContents = () => {
		if (!editMode || !showEditor) {
			return currentSide()
		} else {
			/* Place edit mode editor */
			return (
				<textarea className="cardEditor" onChange={updateCard}
					value={editVal} ref={editor} />
			)
		}
	}

	/* flip the card */
	const flipCard = () => {
		/* This is very ugly and will need to be cleaned up */
		if (showEditor) {
			setEditVal(!flip ? flashcard.BackSide : flashcard.FrontSide)
		}
		setFlip(!flip)
	}

	/* If in edit mode, do nothing when card clicked */
	const cardClick = () => !editMode || !showEditor ? flipCard() : ""

	/* Show card editor */
	const editCard = () => {
		if (!showEditor) {
			setEditVal(currentSide())
		}
		setShowEditor(!showEditor)
	}

	/* If the flashcard changes to a different one, update the editor */
	useEffect(() => {
		setEditVal(currentSide())
		setCardState(flashcard)
	}, [flashcard]) // eslint-disable-line react-hooks/exhaustive-deps

	const deleteCard = () => delfunc(flashcard)

	return (
		<div>
			{editMode ?
				<button onClick={editCard}>
					{showEditor ? "Done" : "Edit Card"}
				</button> : ""}
			<button onClick={flipCard}>
				Flip
			</button>
			{editMode ?
				<button onClick={deleteCard}>
					Delete
				</button> : ""}
			<div data-testid="card" onClick={cardClick} class="card">
				{cardContents()}
			</div>
		</div>
	)
}
