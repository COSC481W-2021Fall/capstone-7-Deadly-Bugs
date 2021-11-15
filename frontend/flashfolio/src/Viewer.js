import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import Flashcard from "./Flashcard";

import {getUser, getDeck, saveDeck, cloneDeck} from "./Calls.js";

import Popup from "reactjs-popup";


import UserInfoPreview from "./UserInfoPreview.js";
import "./Viewer.css";
import "./styles.css";

import "./NewDeckButton.css";

import {loginContext} from "./App.js";

/*
Viewer

Grabs a deck from the backend.
Displays a single card at a time to the screen.
*/
var shufOrder = [];
var hidden = true;
export default function Viewer({ viewMode = "view" }) {
	const history = useHistory();

	const flashdeck = useRef("");
	const isInitialMount = useRef(true);

	const [flashcard, setFlashcard] = useState("");
	const [cardIterator, setCardIterator] = useState(0);
	const [shufOn, setShufOn] = useState(false);

	const [tileCards, setTileCards] = useState(false);

	const { loginState, loadedAuthState } = useContext(loginContext);

	const [deckOwner, setDeckOwner] = useState(null);

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
		while (shufOrder.length < flashdeck.current.Cards.length) {
			var num = Math.floor(Math.random() * flashdeck.current.Cards.length);
			if (shufOrder.indexOf(num) === -1)
				shufOrder.push(num);
		}
		document.getElementById('shuf').style.visibility = "visible";
		setFlashcard(flashdeck.current.Cards[shufOrder[cardIterator]]);
	}

	function unshufFunction() {
		hidden = true;
		setCardIterator(0);
		setShufOn(false);
		setFlashcard(flashdeck.current.Cards[cardIterator]);
	}

	let { deckId } = useParams();


	function saveChanges(){
		if (loginState !== null) {
			console.log(flashdeck.current)
			saveDeck(loginState.tokenId, flashdeck.current)
		}
	}

	function cloneD(){
		console.log(flashdeck.current)
		cloneDeck(flashdeck.current)
	}

	function changeLayout() {
		setTileCards(!tileCards)
	}


	function tileLayout() {
		if (tileCards) {
			return (
				<div class="flash-grid">
					{flashdeck.current.Cards.map(fc => {
						return <div><Flashcard flashcard={fc} editMode={viewMode == "edit"} /></div>
					})}
				</div>
			)
		}
		return (
			<Flashcard flashcard={flashcard} editMode={viewMode == "edit"} />
		)
	}

	useEffect(async () => {
		let deck = await getDeck(Number(deckId));
		flashdeck.current = deck;
		setFlashcard(flashdeck.current.Cards[0]);
		let owner = await getUser(flashdeck.current.Owner);
		setDeckOwner(owner);
	}, [deckId]);

	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
		}
		else {
			/* useEffect code here to be run on count update only */
			if (cardIterator < flashdeck.current.Cards.length) {
				if ((!shufOn))
					setFlashcard(flashdeck.current.Cards[cardIterator]);
				else
					setFlashcard(flashdeck.current.Cards[shufOrder[cardIterator]]);
			}
			else { setCardIterator(0); }
		}
	}, [cardIterator])

	useEffect(() => {
		if (viewMode === "edit" && loadedAuthState && flashdeck.current != "" && (loginState === null || loginState.googleId != flashdeck.current.Owner)) {
			history.replace("/view/"+deckId)
		}
	}, [loginState, loadedAuthState, flashdeck.current]);

	function addCard() {
		flashdeck.current.Cards[flashdeck.current.Cards.length] = {FrontSide: "", BackSide: ""};
		setCardIterator(flashdeck.current.Cards.length-1);
		setFlashcard(flashdeck.current.Cards[cardIterator]);
	}

	function deleteCard() {
		/* if there's 1 card, then make an empty card*/
		if (flashdeck.current.Cards.length === 1) {
			flashdeck.current.Cards[0] = {};
			flashdeck.current.Cards[0].FrontSide = "";
			flashdeck.current.Cards[0].BackSide = "";
			/* view the blank card */
			setFlashcard(flashdeck.current.Cards[cardIterator]);
			return;
		}

		/* delete the card */
		delete flashdeck.current.Cards[cardIterator];

		/* update Cards removing the null pointer */
		flashdeck.current.Cards = flashdeck.current.Cards.filter(function () { return true; });

		/* update view to the next card or cycle to beginning if deleting the last card */
		if (cardIterator < flashdeck.current.Cards.length) {
			setFlashcard(flashdeck.current.Cards[cardIterator])
		} else {
			setCardIterator(0);
			setFlashcard(flashdeck.current.Cards[0]);
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
			Title: {flashdeck.current.Title}
			DeckId: {deckId}
			<br />
			{ (loginState !== null && loginState.googleId === flashdeck.current.Owner) &&
				<button onClick = {flipView}> {viewMode == "edit" ? "View Deck" : "Edit Deck"} </button>
			}
			{viewMode == "edit" && <button onClick={changeLayout}>Change Layout</button>}
			{tileLayout()}
			{!tileCards && <button
				onClick={() => setCardIterator(cardIterator + 1)}
			>Next Card</button>}
			{viewMode == "view" && (hidden ?
				<button id="shuf" onClick={() => shufFunction()}>Shuffle</button> :
				<button id="unshuf" onClick={() => shufOn ? unshufFunction() : null}>Unshuffle</button>)
			}
			{viewMode === "edit" && <button onClick = {addCard}>Add a card</button>}
			{viewMode === "edit" && <button onClick={deleteCard}>
				Delete</button>}
			<a
				href={`data:text/json;charset=utf-8,${encodeURIComponent(
					JSON.stringify(flashdeck.current, null, '\t')
				)}`}
				download="myDeck.json"
			>Download</a>
			{viewMode == "edit" && <button onClick={saveChanges}>Save Changes</button>}
			{viewMode == "edit" && <button onClick={cloneD}>Clone Deck</button>}
			<button onClick={homeButton}>Home</button>
			<button onClick={loadButton}>Load Deck</button>

			{/* Pop up showing deck information */}
			<Popup trigger={<a>Info</a>} position="right center" modal>
				<div className="modal">
					<div className="header">
						{flashdeck.current.Title}
					</div>
					{flashdeck.current.Cards !== undefined && flashdeck.current.Cards.length} Cards
					<br/>
					Created by:
					<br/>
					<img src={deckOwner === null ? "" : deckOwner.ProfilePicture} />
					{deckOwner === null ? "" : deckOwner.NickName}
					<br/>
					Deck# {flashdeck.current.ID}
				</div>
			</Popup>
		</div>
	);
}
