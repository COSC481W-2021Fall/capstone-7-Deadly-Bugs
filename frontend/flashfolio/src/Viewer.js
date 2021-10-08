import React, {useState, useEffect, useRef} from "react";
import {useParams} from "react-router-dom";
import Flashcard from "./Flashcard";


/*
Viewer

Grabs a deck from the backend.
Displays a single card at a time to the screen.
*/
export default function Viewer() {

	const flashdeck = useRef("");
	const isInitialMount = useRef(true);

	const [flashcard, setFlashcard] = useState("");
	const [cardIterator, setCardIterator] = useState(0);

	let { deckId } = useParams();

	useEffect(() => {


		/* Set up and send req to get deck from backend */
		let reqOpt = {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({'ID': Number(deckId)}),
		}

		/* Send the Request */
		fetch('http://localhost:1337/getDeck', reqOpt)
			.then(resp => resp.json())
			.then(data => {
					/* Update the deck to reflect what is on the server 
					   Warning is ignored as this Effect is only triggered once */
					// eslint-disable-next-line
					flashdeck.current = data;
					setFlashcard(flashdeck.current.Cards[0]);
				});
	}, []);

	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
		} 
		else {
			 // useEffect code here to be run on count update only
			if(cardIterator < flashdeck.current.Cards.length) {
				setFlashcard(flashdeck.current.Cards[cardIterator]);
			}
			else { setCardIterator(0); }
		}
	}, [cardIterator])

	return (
		<div>
		CardId: {deckId}
		<Flashcard flashcard={flashcard} />
		<button
			onClick={() => setCardIterator(cardIterator + 1)}
			>Next Card</button>
		</div>
	);
}