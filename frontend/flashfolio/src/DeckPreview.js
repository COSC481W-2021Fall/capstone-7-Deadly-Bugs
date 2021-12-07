import React, { useEffect, useState, useContext } from "react"

/* Internal Dependencies */
import { getDeck } from "./Calls.js"
import { loginContext, themeContext } from "./App.js"

/* Styling */
import "./FlashcardPreview.css"


export default function DeckPreview({ deckId }) {
	const [deck, setDeck] = useState(null)
	const [firstFlashcard, setFirstFlashcard] = useState("")
	const { loginState } = useContext(loginContext)
	const { dark } = useContext(themeContext)

	useEffect(() => {
		const fetchData = async () => {
			let res = await getDeck(deckId, (loginState !== null ? loginState.tokenId : ""));
			setDeck(res)
		}
		fetchData()
	}, [deckId, loginState])

	useEffect(() => {
		if (deck !== null)
			setFirstFlashcard(deck.Cards[0].FrontSide)
	}, [deck])

	if (deck !== null) return (
		<div>
			Title: {deck.Title}
			<div className="card_preview" data-theme={dark ? "darkPreview" : "lightPreview"}>{firstFlashcard}</div>
			Author: {deck.Owner}
		</div>
	)
	else return null
}
