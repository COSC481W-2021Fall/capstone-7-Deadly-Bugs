import React, {useState, useRef, useEffect} from 'react'
import './Flashcard.css'

export default function Flashcard({flashcard, editMode=false, flashdeck}) {

	const [flip, setFlip] = useState(false);
	const [showEditor, setShowEditor] = useState(false);	

	/* Returns appropriate side according to flip state */
	const currentSide = () => flip ? flashcard.BackSide : flashcard.FrontSide;

	/* Ref for the actual textarea (maybe can be removed?)*/
	const editor = useRef(null);

	/* State for the editor textarea's value */
	const [editVal, setEditVal] = useState("");

	/* Executed when editor textarea is changed by user */
	const updateCard = () => {
		/* update editVal to reflect changes */
		setEditVal(editor.current.value);
		/* update actual card to reflect changes */
		if (flip) {
			flashcard.BackSide = editor.current.value;
		} else {
			flashcard.FrontSide = editor.current.value;
		}
	}

	/* Gets the card divs current contents (View/Edit Mode) */
	const cardContents = () => {
		if (!editMode || !showEditor) {
			return currentSide();
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
			setEditVal(!flip ? flashcard.BackSide : flashcard.FrontSide);
		}
		setFlip(!flip)
	}

	/* If in edit mode, do nothing when card clicked */
	const cardClick = () => !editMode || !showEditor ? flipCard() : "";

	/* Show card editor */
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

	function deleteCard() {
		/* if there's 1 card, then make an empty card
		if (flashdeck.current.Cards.length === 1) {
			flashdeck.current.Cards[0] = {};
			flashdeck.current.Cards[0].FrontSide = "";
			flashdeck.current.Cards[0].BackSide = "";
			/* view the blank card 
			setFlashcard(flashdeck.current.Cards[cardIterator]);
			
			return;
		}
		*/

		/* delete the card */
		var index = flashdeck.current.Cards.indexOf(flashcard);
		delete flashdeck.current.Cards[index];

		/* update Cards removing the null pointer */
		flashdeck.current.Cards = flashdeck.current.Cards.filter(function () { return true; });

		/* update view */
		flashdeck.current.Cards.map(fc => {
			return <div><Flashcard flashcard={fc} editMode={editMode} flashdeck={flashdeck} /></div>
		});
		
		//cardContents();
		}

	return (
		<div>
		{editMode ? 
			<button onClick={editCard}>
				{showEditor ? "Done" : "Edit Card"} 
			</button>:""}
		<button onClick={flipCard}>
			Flip
		</button>
		<button onClick={deleteCard}>
			Delete
		</button>
		<div data-testid = "card" onClick={cardClick} class="card">
			{cardContents()}
		</div>
		</div>
	)
}
