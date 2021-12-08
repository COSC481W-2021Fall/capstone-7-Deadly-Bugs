import React, { useContext, useEffect, useRef, useState } from "react"

/* External Dependencies */
import Popup from "reactjs-popup"
import { FilePicker } from "react-file-picker"
import { useHistory, useParams } from "react-router-dom"

/* Internal Dependencies */
import Flashcard from "./Flashcard.js"
import UserProfilePreview from "./UserProfilePreview.js"
import { loginContext, themeContext } from "./App.js"
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
//let incorrectCardCounter = [];

export default function Viewer({ viewMode = "view" }) {
	const history = useHistory()

	const [flashdeck, setFlashdeck] = useState("")
	const isInitialMount = useRef(true)

	const [flashcard, setFlashcard] = useState("")
	const [cardIterator, setCardIterator] = useState(0)
	const [shufOn, setShufOn] = useState(false)

	const [tileCards, setTileCards] = useState(false)

	const { loginState, loadedAuthState } = useContext(loginContext)
	const { dark } = useContext(themeContext)

	const [isPrivate, setIsPrivate] = useState(false)

	//const [numOfClicks, setNumOfClicks] = useState(0)

	/* Game state -- is the user currently playing or viewing their score? */
	const [gameState, setGameState] = useState("play")

	let gameIsInit = false;

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

	const toggleStudyView = () => {
		resetGame();
		if (viewMode === "study" && gameState === "play") setGameState("review");
		else history.replace((viewMode === "view" ? "/study/":"/view/") + deckId);
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
		if (viewMode === "study" && !gameIsInit && flashdeck !== "") {
			resetGame();
			gameIsInit = true;
		}
	}, [viewMode, flashdeck])

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

	const getNextCardStudy = () => {
		let r = shufOn ? shufOrder : [...flashdeck.Cards.keys()]
		let f = r.filter((i) => !flashdeck.Cards[i].correct)
		if (f.length === 0) return -1;
		let c = f.map((i) => flashdeck.Cards[i])
		let i = c.indexOf(flashdeck.Cards[cardIterator])
		if (i === -1) return -1;
		if (i === f.length - 1) return f[0];
		return f[i+1];
	}

	const getPrevCardStudy = () => {
		let r = shufOn ? shufOrder : [...flashdeck.Cards.keys()]
		let f = r.filter((i) => !flashdeck.Cards[i].correct)
		if (f.length === 0) return -1;
		let c = f.map((i) => flashdeck.Cards[i])
		let i = c.indexOf(flashdeck.Cards[cardIterator])
		if (i === -1) return -1;
		if (i === 0) return f[f.length-1];
		return f[i-1];
	}

	const nextCard = () => {
		if (viewMode === "study" && gameState === "play") {
			let next = getNextCardStudy()
			console.log(next)
			next = next !== -1 ? next : 0
			setCardIterator(next)
		} else {
			setCardIterator(cardIterator + 1)
		}
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

	const resetGame = () => {
		flashdeck.Cards.map((c) => {c.wrong = 0; c.correct = false;});
		setGameState("play");
	}

	const previousCard = () => {
		if (viewMode === "study" && gameState === "play") {
			let prev = getPrevCardStudy()
			console.log(prev)
			prev = prev !== -1 ? prev : 0
			setCardIterator(prev)
		} else {
			if (cardIterator === 0) {
				setCardIterator(flashdeck.Cards.length - 1)
			} else {
				setCardIterator(cardIterator - 1)
			}
		}
	}

	function collectCards(isCorrect) {
		if (isCorrect) {
			let i = cardIterator;
			nextCard();
			flashdeck.Cards[i].correct = true;
		}
		else {
			//incorrectCardCounter[cardIterator] += 1
			flashcard.wrong++;
			nextCard();
		}
		
		/* Check if all cards have been set to correct */
		if (flashdeck.Cards.reduce((t, c) => t && c.correct, true)) {
			console.log("Game over!");
			setGameState("review");
			setCardIterator(0);
		}
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
			<h2>{flashdeck.Title}</h2>
			{(loginState !== null && loginState.googleId === flashdeck.Owner) && (viewMode !== "study") &&
				<button onClick={flipView}> {viewMode === "edit" ? "View Deck" : "Edit Deck"} </button>
			}
			{(viewMode !== "edit") && <button onClick={toggleStudyView}> {viewMode === "study" ? gameState === "play" ? "End Game" : "Return to View" : "Start Game"} </button>}
			{viewMode === "edit" && <button onClick={changeLayout}>Change Layout</button>}
			<br />
			{viewMode === "study" && gameState === "play" && <button onClick={() => collectCards(true)}>I got it right</button>}
			{viewMode === "study" && gameState === "play" && <button onClick={() => collectCards(false)}>I got it wrong</button>}
			{tileLayout()}
			{ viewMode === "study" && gameState === "review" && <div> You got the card wrong {flashcard.wrong} times</div>}
			<br />
			{!tileCards && <button
				onClick={previousCard}
			>Previous Card</button>}
			{!tileCards && <button onClick={nextCard}>Next Card</button>}
			{viewMode !== "edit" && (hidden ?
				<button id="shuf" onClick={() => shufFunction()}>Shuffle</button> :
				<button id="unshuf" onClick={() => shufOn ? unshufFunction() : null}>Unshuffle</button>)
			}
			{viewMode === "edit" && <button onClick={addCard}>Add a card</button>}
			{viewMode === "edit" && <button onClick={saveChanges}>Save Changes</button>}
			{viewMode !== "study" && loginState !== null && <button onClick={cloneD}>Clone Deck</button>}
			{/* Pop up for delete deck */}
			<Popup trigger={viewMode === "edit" && <button>Delete Deck</button>} position="right center" modal>
				{close => (             
					<div className="modal" data-theme={dark ? "dark" : "light"}>
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
				<div className="modal" data-theme={dark ? "dark" : "light"}>
					<div className="header">
						{flashdeck.Title}
					</div>
					{flashdeck.Cards !== undefined && flashdeck.Cards.length} Cards
					<br />
					Created by:
					<br />
					<UserProfilePreview userId={flashdeck.Owner} />

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
