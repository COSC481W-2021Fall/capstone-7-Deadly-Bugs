import React, { useState, useRef, useCallback, useContext, useEffect } from "react"

/* External Dependencies */
import { useHistory } from "react-router-dom"

/* Internal Dependencies */
import DeckSearch from "./DeckSearch.js"
import DeckPreview from "./DeckPreview"
import { getUser } from "./Calls.js"
import { loginContext } from "./App.js"

/* Styling */
import "./Viewer.css"

export default function Load() {

	const { loginState } = useContext(loginContext)

	const [query, setQuery] = useState("") // setQuery was defined but never used
	const [pageNumber, setPageNumber] = useState(0)
	const [myDecks, setMyDecks] = useState([])

	const queryField = useRef("");

	const {
		decks,
		hasMore,
		loading,
	} = DeckSearch(query, pageNumber)

	useEffect(() => {
		const fetchData = async () => {
			console.log(loginState)
			if (loginState !== null) {
				let user = await getUser(loginState.googleId)
				setMyDecks(user.OwnedDecks)
			}
		}
		fetchData()
	}, [loginState])

	const observer = useRef()
	const lastDeckElementRef = useCallback(node => {
		if (loading) return
		if (observer.current) observer.current.disconnect()
		observer.current = new IntersectionObserver(entries => {
			if (entries[0].isIntersecting && hasMore) {
				setPageNumber(pageNumber + 1)
			}
		})
		if (node) observer.current.observe(node)
	}, [loading, hasMore, pageNumber])

	// function defined but never used 
	/*
	function handleSearch(e) {
		setQuery(e.target.value)
		setPageNumber(1)
	}
	*/

	const updateQuery = () => {
		console.log(queryField.current.value)
		setQuery(queryField.current.value)
	}

	const history = useHistory()

	const visit = (id) => history.push("/view/" + id)

	return (
		<div>
			<input type="text" ref={queryField} onChange={updateQuery}/>
			{loginState !== null && query == "" &&
				<>
					<h3>My Decks:</h3><br />
					<div className="flash-grid">
						{myDecks.map((deck, index) => {
							return <div key={deck} onClick={() => { visit(deck) }}><DeckPreview deckId={deck} /></div>
						})}
					</div>
				</>}
			<h3>Public Decks:</h3><br />
			<div className="flash-grid">
				{decks.map((deck, index) => {
					if (decks.length === index + 1) {
						return <div ref={lastDeckElementRef} key={deck} onClick={() => { visit(deck) }}><DeckPreview deckId={deck} /></div>
					} else {
						return <div key={deck} onClick={() => { visit(deck) }}> <DeckPreview deckId={deck} /></div>
					}
				})}
			</div>
		</div>
	)
}
