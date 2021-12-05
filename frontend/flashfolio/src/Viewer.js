import React, { useContext, useEffect, useRef, useState } from "react"

/* External Dependencies */
import Popup from "reactjs-popup"
import { FilePicker } from "react-file-picker"
import { useHistory, useParams } from "react-router-dom"

/* Internal Dependencies */
import Flashcard from "./Flashcard.js"
import UserInfoPreview from "./UserInfoPreview.js"
import { loginContext } from "./App.js"
import { cloneDeck, getDeck, getUser, saveDeck, deleteDeck } from "./Calls.js"

/* Styling */
import "./Viewer.css"
import "./styles.css"
import "./NewDeckButton.css"


/*
Viewer

Grabs a deck from the backend.
Displays a single card at a time to the screen.
*/
// Why does shuffling only work if these are here???? why???
let shufOrder = []
let hidden = true
let isEndGameClicked = false
let backupOriginalCards = [];
let incorrectCardCounter = [];

export default function Viewer({ viewMode = "view" }) {
	const history = useHistory()

	const [flashdeck, setFlashdeck] = useState("")
	const isInitialMount = useRef(true)

	const [flashcard, setFlashcard] = useState("")
	const [cardIterator, setCardIterator] = useState(0)
	const [shufOn, setShufOn] = useState(false)

	const [tileCards, setTileCards] = useState(false)

	const { loginState, loadedAuthState } = useContext(loginContext)

	const [deckOwner, setDeckOwner] = useState(null)

	const [isPrivate, setIsPrivate] = useState(false)

	const [numOfClicks, setNumOfClicks] = useState(0)

	const handlePrivacyChange = () => {
		setIsPrivate(!isPrivate)
		flashdeck.IsPublic = isPrivate
	}

	/* Flips between edit and view mode */
	function flipView() {
		if (viewMode === "view")
			history.replace("/edit/" + deckId)
		else {
			if (tileCards)
				setTileCards(false)
			history.replace("/view/" + deckId)
		}
	}

	function toggleStudyView() {
		if (viewMode === "view") {
			history.replace("/study/" + deckId)
		}
		else {
			history.replace("/view/" + deckId)
		}
	}

	/* Shuffles cards in the deck */
	function shufFunction() {
		hidden = false
		setCardIterator(0)
		setShufOn(true)
		shufOrder = []
		while (shufOrder.length < flashdeck.Cards.length) {
			var num = Math.floor(Math.random() * flashdeck.Cards.length)
			if (shufOrder.indexOf(num) === -1)
				shufOrder.push(num)
		}
		document.getElementById("shuf").style.visibility = "visible"
		setFlashcard(flashdeck.Cards[shufOrder[cardIterator]])
	}

	function unshufFunction() {
		hidden = true
		setCardIterator(0)
		setShufOn(false)
		setFlashcard(flashdeck.Cards[cardIterator])
	}

	let { deckId } = useParams()

	function saveChanges() {
		if (loginState !== null) {
			saveDeck(loginState.tokenId, flashdeck)
		}
	}

	/* Deletes the current deck */
	async function delDeck() {
		if (loginState !== null) {
			let resp = await deleteDeck(loginState.tokenId, flashdeck);
			if (resp.ok) history.push("/load");
		}
	}

	async function cloneD() {
		if (loginState !== null) {
			let resp = await cloneDeck(loginState.tokenId, flashdeck)
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

	useEffect(() => {
		const fetchData = async () => {
			let deck = await getDeck(Number(deckId), loginState !== null ? loginState.tokenId : "")
			setFlashdeck(deck)
		}
		fetchData()
	}, [deckId, loginState])

	useEffect(() => {
		if (!isInitialMount.current) {
			const fetchData = async () => {
				setFlashcard(flashdeck.Cards[0])
				let owner = await getUser(flashdeck.Owner)
				setDeckOwner(owner)
				/* Set Privacy toggle to match deck info */
				setIsPrivate(!flashdeck.IsPublic)
			}
			fetchData()
		}
	}, [flashdeck])

	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false
		}
		else {
			/* useEffect code here to be run on count update only */
			if (cardIterator < flashdeck.Cards.length) {
				if ((!shufOn)) {
					setFlashcard(flashdeck.Cards[cardIterator])
				}
				else {
					setFlashcard(flashdeck.Cards[shufOrder[cardIterator]])
				}
			}
			else { setCardIterator(0) }
		}
	}, [cardIterator, flashdeck.Cards, shufOn])

	useEffect(() => {
		if (viewMode === "edit" && loadedAuthState && flashdeck !== "" && (loginState === null || loginState.googleId !== flashdeck.Owner)) {
			history.replace("/view/" + deckId)
		}
	}, [loginState, loadedAuthState, flashdeck, deckId, history, viewMode])


	function addCard() {
		flashdeck.Cards[flashdeck.Cards.length] = { FrontSide: "", BackSide: "" }
		setCardIterator(flashdeck.Cards.length - 1)
		setFlashcard(flashdeck.Cards[cardIterator])
	}

	function deleteCard(card, clear) {
		/* hacky way of copying */
		let copy = { ...flashdeck }
		copy.Cards = flashdeck.Cards
		/* if there's one card, make a blank card */
		if (copy.Cards.length === 1) {
			copy.Cards[0] = {
				FrontSide: "",
				BackSide: ""
			}
			setFlashcard(copy.Cards[0])
			return
		}

		/* delete the card */
		var index = copy.Cards.indexOf(card)
		delete copy.Cards[index]

		/* update Cards list by removing the null pointer */
		copy.Cards = copy.Cards.filter(function () { return true })
		setFlashdeck(copy)
	}

	function previousCard() {
		if (cardIterator === 0) {
			setCardIterator(flashdeck.Cards.length - 1)
		} else {
			setCardIterator(cardIterator - 1)
		}
	}

	function collectCards(isCorrect) {
		if (isCorrect)
			deleteCard(flashdeck.Cards[cardIterator])
		else {
			incorrectCardCounter[cardIterator] += 1
			setCardIterator(cardIterator + 1)
		}
	}

	function addGameCard(cardsArray) {
		let i = 0
		console.log(cardsArray.length)
		while (i < cardsArray.length) {
			flashdeck.Cards[i] = backupOriginalCards[i]
			i++
		}
	}

	function endGame() {
		setNumOfClicks(numOfClicks + 1)
		setCardIterator(0)
		setFlashcard(flashdeck.Cards[0])

		if (viewMode !== "study") {
			let i = 0;
			backupOriginalCards = []
			while (i < flashdeck.Cards.length) {
				incorrectCardCounter[i] = 0
				backupOriginalCards.push(flashdeck.Cards[i])
				i++
			}
			toggleStudyView()
		}
		else {
			addGameCard(backupOriginalCards)
			if (flashdeck.Cards[0].FrontSide === "" && flashdeck.Cards[0].BackSide === "")
				deleteCard(flashdeck.Cards[0])
			setFlashcard(flashdeck.Cards[0])
		}
		if (numOfClicks === 1) {
			displaySummary()
		}
		if (numOfClicks === 2) {
			setNumOfClicks(0);
			toggleStudyView()
		}
	}

	function displaySummary() {
		
	}

	/* Import button when editing */
	const importButton = () => {
		const onChange = async (f) => {
			let text = await f.text()
			let deck = JSON.parse(text)
			deck.ID = flashdeck.ID
			deck.IsPublic = flashdeck.IsPublic
			deck.Owner = flashdeck.Owner
			setFlashdeck(deck)
		}
		/* Returns this component */
		return (
			<FilePicker
				extensions={["json"]}
				onChange={(FileObject) => onChange(FileObject)}
			>
				<button>
					Import
				</button>
			</FilePicker>
		)
	}

	return (
		<div>
			<UserInfoPreview />
			Title: {flashdeck.Title}
			DeckId: {deckId}
			<br />
			{(loginState !== null && loginState.googleId === flashdeck.Owner) && (viewMode !== "study") &&
				<button onClick={flipView}> {viewMode === "edit" ? "View Deck" : "Edit Deck"} </button>
			}
			{(viewMode !== "edit") && <button onClick={() => endGame()}> {viewMode === "study" ? "End Game" : "Start Game"}</button>}
			{viewMode === "edit" && <button onClick={changeLayout}>Change Layout</button>}
			<br />
			{viewMode === "study" && numOfClicks !== 2 && <button onClick={() => collectCards(true)}>I got it right</button>}
			{viewMode === "study" && numOfClicks !== 2 && <button onClick={() => collectCards(false)}>I got it wrong</button>}
			{tileLayout()}
			{ numOfClicks===2 && <div> You got the card wrong {incorrectCardCounter[cardIterator]} times</div>}
			<br />
			{!tileCards && <button
				onClick={previousCard}
			>Previous Card</button>}
			{!tileCards && <button onClick={() => setCardIterator(cardIterator + 1)}
			>Next Card</button>}
			{viewMode !== "edit" && (hidden ?
				<button id="shuf" onClick={() => shufFunction()}>Shuffle</button> :
				<button id="unshuf" onClick={() => shufOn ? unshufFunction() : null}>Unshuffle</button>)
			}
			{viewMode === "edit" && <button onClick={addCard}>Add a card</button>}
			{viewMode === "edit" && <button onClick={deleteCard}>Delete</button>}
			{viewMode === "edit" && <button onClick={saveChanges}>Save Changes</button>}
			{viewMode !== "study" && loginState !== null && <button onClick={cloneD}>Clone Deck</button>}
			{/* Pop up for delete deck */}
			<Popup trigger={viewMode === "edit" && <button>Delete Deck</button>} position="right center" modal>
				{close => (             
					<div className="modal">
						<div className="header">
							{flashdeck.Title}
						</div>
						Are you sure you want to delete this deck?<br/>
						<button onClick={() => {delDeck(); close();}}>Yes</button>
						<button onClick={close}>No</button>
					</div>
				)}
			</Popup>

			{/* Pop up showing deck information */}
			<Popup trigger={<button>Info</button>} position="right center" modal>
				<div className="modal">
					<div className="header">
						{flashdeck.Title}
					</div>
					{flashdeck.Cards !== undefined && flashdeck.Cards.length} Cards
					<br />
					Created by:
					<br />
					<img src={deckOwner === null ? "" : deckOwner.ProfilePicture} alt="deck owner" />
					{deckOwner === null ? "" : deckOwner.NickName}
					{viewMode === "edit" &&
						<>
							<br />
							Private Deck? <input type="checkbox" checked={isPrivate} onChange={handlePrivacyChange} />
						</>
					}
					<br />
					<a
						href={`data:text/json;charset=utf-8,${encodeURIComponent(
							JSON.stringify(flashdeck, null, "\t")
						)}`}
						download={flashdeck.Title + ".json"}
					>Download This Deck</a>
					<br />
					Deck# {flashdeck.ID}
				</div>
			</Popup>
			{viewMode === "edit" && importButton()}
		</div>
	)
}
