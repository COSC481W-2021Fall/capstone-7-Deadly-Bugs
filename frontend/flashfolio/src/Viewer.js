import React, {useState, useEffect, useRef} from "react";
import {useParams} from "react-router-dom";
import Flashcard from "./Flashcard";
import {getDeck} from "./Calls.js";

/*
Viewer

Grabs a deck from the backend.
Displays a single card at a time to the screen.
*/
var shufOrder = [];
var hidden = true;
export default function Viewer({viewMode="view"}) {

	const flashdeck = useRef("");
	const isInitialMount = useRef(true);

	const [flashcard, setFlashcard] = useState("");
	const [cardIterator, setCardIterator] = useState(0);
	const [shufOn, setShufOn] = useState(false);

	function shufFunction(){
		hidden = false;
		setCardIterator(0);
		setShufOn(true);
		shufOrder = [];
		while(shufOrder.length < flashdeck.current.Cards.length){
			var num = Math.floor(Math.random()*flashdeck.current.Cards.length);
			if(shufOrder.indexOf(num)===-1)
				shufOrder.push(num);
		}
		document.getElementById('shuf').style.visibility="visible";
		setFlashcard(flashdeck.current.Cards[shufOrder[cardIterator]]);
	}

	function unshufFunction(){
		hidden = true;
		setCardIterator(0);
		setShufOn(false);
		setFlashcard(flashdeck.current.Cards[cardIterator]);
	}

	let { deckId } = useParams();

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
				if((!shufOn))
					setFlashcard(flashdeck.current.Cards[cardIterator]);
				else
					setFlashcard(flashdeck.current.Cards[shufOrder[cardIterator]]);		
			}
			else { setCardIterator(0); }
		}
	}, [cardIterator])

	function deleteCard() {
		/* delete the card */
		delete flashdeck.current.Cards[cardIterator];

		/* remove the null pointer */
		flashdeck.current.Cards = flashdeck.current.Cards.filter(function() {return true;});

		/* update view to next card or cycle to beginning if deleting the last card */
		if(cardIterator < flashdeck.current.Cards.length) {
			setFlashcard(flashdeck.current.Cards[cardIterator])
		} else {
			setCardIterator(0);
			setFlashcard(flashdeck.current.Cards[0]);}
	}

	return (
		<div>
		Title: {flashdeck.current.Title}
		DeckId: {deckId}
		<Flashcard flashcard={flashcard} editMode={viewMode == "edit"} />
		<button onClick={() => setCardIterator(cardIterator + 1)}
			>Next Card</button>

		{!flashcard.showEditor ? 
		hidden ?
		<button id="shuf" onClick = {() => shufFunction()}>Shuffle</button> :
		<button id="unshuf" onClick = {() => shufOn ? unshufFunction() : null}>Unshuffle</button>
		:
		null}

		<button onClick={deleteCard}>
			Delete</button>

		<a
            href={`data:text/json;charset=utf-8,${encodeURIComponent(
              JSON.stringify(flashdeck.current, null, '\t')
            )}`}
            download="myDeck.json"
          >{`Download`}</a>
		</div>
	);
}
