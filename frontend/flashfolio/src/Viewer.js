import React, {useState, useEffect, useRef} from "react";
import {useParams} from "react-router-dom";
import Flashcard from "./Flashcard";
import {getDeck} from "./Calls.js";

/*
Viewer

Grabs a deck from the backend.
Displays a single card at a time to the screen.
*/
export default function Viewer() {

	const flashdeck = useRef();

	const [flashcard, setFlashcard] = useState("");

	let { deckId } = useParams();

	useEffect(() => {
		getDeck(Number(deckId))
			.then(deck => {
				flashdeck.current = deck;
				setFlashcard(flashdeck.current.Cards[0]);
			});
	}, [deckId]);

	return (
		<div>
		CardId: {deckId}
		<Flashcard flashcard={flashcard} />
		</div>
	);
}
