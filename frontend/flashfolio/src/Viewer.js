import React, {useState, useEffect, useRef} from "react";
import {useParams} from "react-router-dom";
import Flashcard from "./Flashcard";
import {getDeck, saveDeck} from "./Calls.js";

/*
Viewer

Grabs a deck from the backend.
Displays a single card at a time to the screen.
*/
export default function Viewer({viewMode="view"}) {

	const flashdeck = useRef("");
	const isInitialMount = useRef(true);

	const [flashcard, setFlashcard] = useState("");
	const [cardIterator, setCardIterator] = useState(0);

	let { deckId } = useParams();

	function saveChanges() {
		console.log(flashdeck.current)
		saveDeck(flashdeck.current)
	}

	useEffect(() => {
		getDeck(Number(deckId))
			.then(deck => {
				flashdeck.current = deck;
				setFlashcard(flashdeck.current.Cards[0]);
			});
	}, [deckId]);

	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
		} 
		else {
			/* useEffect code here to be run on count update only */
			if(cardIterator < flashdeck.current.Cards.length) {
				setFlashcard(flashdeck.current.Cards[cardIterator]);
			}
			else { setCardIterator(0); }
		}
	}, [cardIterator])

	return (
		<div>
		DeckId: {deckId}
		<Flashcard flashcard={flashcard} editMode={viewMode == "edit"} />
		<button
			onClick={() => setCardIterator(cardIterator + 1)}
			>Next Card</button>
		{viewMode == "edit" && <button onClick={saveChanges}>Save Changes</button>}
		</div>
	);
}
