import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import Flashcard from "./Flashcard";


/*
Viewer

Grabs a deck from the backend.
Displays a single card at a time to the screen.
*/
export default function Viewer() {

	let flashdeck = "";

	const [flashcard, setFlashcard] = useState("");

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
					flashdeck = data;
					setFlashcard(flashdeck.Cards[0]);
				});
	}, [])

	return (
		<div>
		CardId: {deckId}
		<Flashcard flashcard={flashcard} />
		</div>
	);
}
