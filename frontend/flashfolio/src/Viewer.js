import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import Flashcard from "./Flashcard";

export default function Viewer() {

	let flashdeck = "";

	const [flashcard, setFlashcard] = useState("");

	let { deckId } = useParams();

	useEffect(() => {

		let reqOpt = {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({'ID': Number(deckId)}),
		}

		fetch('http://localhost:1337/getDeck', reqOpt)
			.then(resp => resp.json())
			.then(data => {
					flashdeck = data;
					setFlashcard(flashdeck.Cards[0]);
				 });


		console.log(flashcard)

	}, [])

	return (
		<div>
		CardId: {deckId}
		<Flashcard flashcard={flashcard} />
		</div>
	);
}
