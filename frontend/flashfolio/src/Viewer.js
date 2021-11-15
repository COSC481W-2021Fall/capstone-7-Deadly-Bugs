import React, { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import Flashcard from "./Flashcard";
import {getDeck, saveDeck} from "./Calls.js";

import UserInfoPreview from "./UserInfoPreview.js";
import "./Viewer.css";
import "./styles.css";

/*
Viewer

Grabs a deck from the backend.
Displays a single card at a time to the screen.
*/
var shufOrder = [];
var hidden = true;
export default function Viewer({ viewMode = "view" }) {
	const history = useHistory();

	const [flashdeck, setFlashdeck] = useState("");
	const isInitialMount = useRef(true);

	const [flashcard, setFlashcard] = useState("");
	const [cardIterator, setCardIterator] = useState(0);
	const [shufOn, setShufOn] = useState(false);

	const [tileCards, setTileCards] = useState(false);

	function flipView(){
		if(viewMode==="view")
			history.replace("/edit/"+deckId);
		else
		{
			if(tileCards)
				setTileCards(false);
			history.replace("/view/"+deckId);
		}
	}

	function shufFunction() {
		hidden = false;
		setCardIterator(0);
		setShufOn(true);
		shufOrder = [];
		while (shufOrder.length < flashdeck.Cards.length) {
			var num = Math.floor(Math.random() * flashdeck.Cards.length);
			if (shufOrder.indexOf(num) === -1)
				shufOrder.push(num);
		}
		document.getElementById('shuf').style.visibility = "visible";
		setFlashcard(flashdeck.Cards[shufOrder[cardIterator]]);
	}

	function unshufFunction() {
		hidden = true;
		setCardIterator(0);
		setShufOn(false);
		setFlashcard(flashdeck.Cards[cardIterator]);
	}

	let { deckId } = useParams();


	function saveChanges(){
		console.log(flashdeck)
		saveDeck(flashdeck)
	}

	function changeLayout() {
		setTileCards(!tileCards)
	}

	function tileLayout() {
		if (tileCards) {
			return (
				<div class="flash-grid">
					{flashdeck.Cards.map(fc => {
						return <div><Flashcard flashcard={fc} editMode={viewMode === "edit"} flashdeck={flashdeck} /></div>
					})}
				</div>
			)
		}
		return (
			<Flashcard flashcard={flashcard} editMode={viewMode === "edit"} flashdeck={flashdeck} />
		)
	}

	useEffect(() => {
		getDeck(Number(deckId))
			.then(deck => {
				setFlashdeck(deck);
			})
	}, [deckId]);

	/* this will display the current card */
	useEffect(() => {
		if (!isInitialMount.current)
			setFlashcard(flashdeck.Cards[cardIterator])
	}, [flashdeck]);

	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
		}
		else {
			/* useEffect code here to be run on count update only */
			if (cardIterator < flashdeck.Cards.length) {
				if ((!shufOn))
					setFlashcard(flashdeck.Cards[cardIterator]);
				else
					setFlashcard(flashdeck.Cards[shufOrder[cardIterator]]);
			}
			else { setCardIterator(0); }
		}
	}, [cardIterator])

	function addCard() {
		flashdeck.Cards[flashdeck.Cards.length] = {FrontSide: "", BackSide: ""};
		setCardIterator(flashdeck.Cards.length-1);
		setFlashcard(flashdeck.Cards[cardIterator]);
	}

	function previousCard() {
		if (cardIterator===0) {
			setCardIterator(flashdeck.Cards.length - 1);
		} else {
			setCardIterator(cardIterator - 1);
		}
	}

	const loadButton = () => {
		history.push("/load");
	};
	const homeButton = () => {
		history.push("/");
	};

	return (
		<div>
			<UserInfoPreview />
			Title: {flashdeck.Title}
			DeckId: {deckId}
			<br />
			<button onClick = {flipView}> {viewMode === "edit" ? "View Deck" : "Edit Deck"} </button>
			{viewMode === "edit" && <button onClick={changeLayout}>Change Layout</button>}
			{tileLayout()}
			{!tileCards && <button
				onClick={previousCard}
			>Previous Card</button>}
			{!tileCards && <button
				onClick={() => setCardIterator(cardIterator + 1)}
			>Next Card</button>}
			{viewMode === "view" && (hidden ?
				<button id="shuf" onClick={() => shufFunction()}>Shuffle</button> :
				<button id="unshuf" onClick={() => shufOn ? unshufFunction() : null}>Unshuffle</button>)
			}
			{viewMode === "edit" && <button onClick = {addCard}>Add a card</button>}
			<a
				href={`data:text/json;charset=utf-8,${encodeURIComponent(
					JSON.stringify(flashdeck, null, '\t')
				)}`}
				download="myDeck.json"
			>Download</a>
			{viewMode === "edit" && <button onClick={saveChanges}>Save Changes</button>}
			<button onClick={homeButton}>Home</button>
			<button onClick={loadButton}>Load Deck</button>
		</div>
	);
}
