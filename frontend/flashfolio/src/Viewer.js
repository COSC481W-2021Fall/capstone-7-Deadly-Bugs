import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Popup from "reactjs-popup";
import { loginContext } from "./App.js";
import { cloneDeck, getDeck, getUser, saveDeck } from "./Calls.js";
import Flashcard from "./Flashcard";
import "./NewDeckButton.css";
import "./styles.css";
import UserInfoPreview from "./UserInfoPreview.js";
import "./Viewer.css";

/*
Viewer

Grabs a deck from the backend.
Displays a single card at a time to the screen.
*/
var shufOrder = [];
var hidden = true;
export default function Viewer({ viewMode = "view" }) {
	const history = useHistory();

	const [flashdeck, setFlashdeck] = useState({});
	const isInitialMount = useRef(true);

	const [flashcard, setFlashcard] = useState("");
	const [cardIterator, setCardIterator] = useState(0);
	const [shufOn, setShufOn] = useState(false);

	const [tileCards, setTileCards] = useState(false);

	const { loginState, loadedAuthState } = useContext(loginContext);

	const [deckOwner, setDeckOwner] = useState(null);

	const [isPrivate, setIsPrivate] = useState(false);
	const handlePrivacyChange = () => {
		setIsPrivate(!isPrivate);
		flashdeck.IsPublic = isPrivate;
	}

	function flipView() {
		if (viewMode === "view")
			history.replace("/edit/" + deckId);
		else {
			if (tileCards)
				setTileCards(false);
			history.replace("/view/" + deckId);
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

	function saveChanges() {
		if (loginState !== null) {
			console.log(flashdeck)
			saveDeck(loginState.tokenId, flashdeck)
		}
	}

	async function cloneD() {
		if (loginState !== null) {
			console.log(flashdeck)
			let resp = await cloneDeck(loginState.tokenId, flashdeck)
			console.log(resp)

			history.push("/edit/" + resp.ID)
		}
	}

	function changeLayout() {
		setTileCards(!tileCards)
	}

	function tileLayout() {
		if (tileCards) {
			return (
				<div class="flash-grid">
					{flashdeck.Cards.map(fc => {
						return <div><Flashcard flashcard={fc} editMode={viewMode === "edit"} delfunc={deleteCard} /></div>
					})}
				</div>
			)
		}
		return (
			<Flashcard flashcard={flashcard} editMode={viewMode === "edit"} delfunc={deleteCard} />
		)
	}

	useEffect(async () => {
		let deck = await getDeck(Number(deckId), loginState !== null ? loginState.tokenId : "");
		setFlashdeck(deck);
		let owner = await getUser(flashdeck.Owner);
		setDeckOwner(owner);
		/* Set Privacy toggle to match deck info */
		setIsPrivate(!flashdeck.IsPublic);
	}, [deckId, loginState]);

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

	useEffect(() => {
		if (viewMode === "edit" && loadedAuthState && flashdeck != "" && (loginState === null || loginState.googleId != flashdeck.Owner)) {
			history.replace("/view/" + deckId)
		}
	}, [loginState, loadedAuthState, flashdeck]);

	function addCard() {
		flashdeck.Cards[flashdeck.Cards.length] = { FrontSide: "", BackSide: "" };
		setCardIterator(flashdeck.Cards.length - 1);
		setFlashcard(flashdeck.Cards[cardIterator]);
	}

	function deleteCard(card, clear) {
		/* Extremely hacky disgusting way of deepcopying */
		let copy = { ...flashdeck }
		copy.Cards = flashdeck.Cards
		/* if there's one card, make a blank card */
		if (copy.Cards.length === 1) {
			copy.Cards[0] = {
				FrontSide: "",
				BackSide: ""
			}
			setFlashcard(copy.Cards[0]);
			return;
		}

		/* delete the card */
		var index = copy.Cards.indexOf(card);
		delete copy.Cards[index];

		/* update Cards list by removing the null pointer */
		copy.Cards = copy.Cards.filter(function () { return true; });
		setFlashdeck(copy)
		console.log(copy)
		console.log(flashdeck)
	}

	function previousCard() {
		if (cardIterator === 0) {
			setCardIterator(flashdeck.Cards.length - 1);
		} else {
			setCardIterator(cardIterator - 1);
		}
	}

	const getJsonUpload = () =>
		new Promise(resolve => {
			const inputFileElement = document.createElement('input')
			inputFileElement.setAttribute('type', 'file')
			inputFileElement.setAttribute('multiple', 'false')
			inputFileElement.setAttribute('accept', '.json')

			inputFileElement.addEventListener(
				'change',
				async (event) => {
					const { files } = event.target
					if (!files) {
						return
					}

					const filePromises = [...files].map(file => file.text())

					resolve(await Promise.all(filePromises))
				},
				false,
			)
			inputFileElement.click()
		})

	window.onload = function () {
		document.getElementById('upload-button').onclick = async () => {
			/* get the json */
			const jsonFile = await getJsonUpload();

			/* convert to object */
			let tempDeck = JSON.parse(jsonFile);

			/* keep the important properties unchanged */
			tempDeck.ID = flashdeck.ID;
			tempDeck.IsPublic = flashdeck.IsPublic;
			tempDeck.Owner = flashdeck.Owner;

			/* update flashdeck with new title and cards list */
			setFlashdeck(tempDeck);
			console.log(tempDeck);
			console.log(flashdeck);
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
			{(loginState !== null && loginState.googleId === flashdeck.Owner) &&
				<button onClick={flipView}> {viewMode === "edit" ? "View Deck" : "Edit Deck"} </button>
			}
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
			{viewMode === "edit" && <button onClick={addCard}>Add a card</button>}
			{viewMode === "edit" && <button onClick={deleteCard}>
				Delete</button>}
			<a
				href={`data:text/json;charset=utf-8,${encodeURIComponent(
					JSON.stringify(flashdeck, null, '\t')
				)}`}
				download="myDeck.json"
			>Download</a>
			<button id="upload-button">
				Import
			</button>
			{viewMode === "edit" && <button onClick={saveChanges}>Save Changes</button>}
			{loginState !== null && <button onClick={cloneD}>Clone Deck</button>}
			<button onClick={homeButton}>Home</button>
			<button onClick={loadButton}>Load Deck</button>

			{/* Pop up showing deck information */}
			<Popup trigger={<a>Info</a>} position="right center" modal>
				<div className="modal">
					<div className="header">
						{flashdeck.Title}
					</div>
					{flashdeck.Cards !== undefined && flashdeck.Cards.length} Cards
					<br />
					Created by:
					<br />
					<img src={deckOwner === null ? "" : deckOwner.ProfilePicture} />
					{deckOwner === null ? "" : deckOwner.NickName}
					{viewMode === "edit" &&
						<>
							<br />
							Private Deck? <input type="checkbox" checked={isPrivate} onChange={handlePrivacyChange} />
						</>
					}
					<br />
					Deck# {flashdeck.ID}
				</div>
			</Popup>
		</div>
	);
}
