import React, { useState, useRef, useCallback, useContext, useEffect} from 'react'
import { useHistory } from 'react-router-dom';
import Flashcard from "./Flashcard";
import "./Viewer.css";
import DeckSearch from './DeckSearch'

import {getUser} from "./Calls.js"

import DeckPreview from "./DeckPreview";

import "./Viewer.css";

import {loginContext} from "./App.js";

export default function Load() {

	const {loginState} = useContext(loginContext);

	const arrayOfCards = [
		{ FrontSide: "1", BackSide: "1B" },
		{ FrontSide: "2", BackSide: "2B" },
		{ FrontSide: "3", BackSide: "3B" },
		{ FrontSide: "4", BackSide: "4B" },
		{ FrontSide: "5", BackSide: "5B" },
		{ FrontSide: "6", BackSide: "6B" },
		{ FrontSide: "7", BackSide: "7B" },
		{ FrontSide: "8", BackSide: "8B" },
		{ FrontSide: "9", BackSide: "9B" },
		{ FrontSide: "10", BackSide: "10B" },
	  ];
	  
	//////////////////////////////////////////////Erik Test Code
	const [query, setQuery] = useState('')
	const [pageNumber, setPageNumber] = useState(0)
	const [myDecks, setMyDecks] = useState([]);

	const {
		decks,
		hasMore,
		loading,
	} = DeckSearch(query, pageNumber)

	useEffect(async () => {
		console.log(loginState);
		if (loginState !== null) {
			let user = await getUser(loginState.googleId)
			console.log(user);
			setMyDecks(user.OwnedDecks)
		}
	},[loginState]);

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
	}, [loading, hasMore])
	
	function handleSearch(e) {
		setQuery(e.target.value)
		setPageNumber(1)
	}
	/////////////////////////////////////////////////////////////Erik End
	
	const history = useHistory();

	const visit = (id) => history.push("/view/" + id);

	return (
		<div>
			{loginState !== null &&
			<>
				<h3>My Decks:</h3><br/>
				<div className="flash-grid">
				{myDecks.map((deck, index) => {
					return <div key={deck} onClick={()=>{visit(deck)}}><DeckPreview deckId={deck}/></div>
				})}
				</div>
			</>}
			<h3>Public Decks:</h3><br/>
				<div className="flash-grid">
				{decks.map((deck, index) => {
					if (decks.length === index + 1) {
						return <div ref={lastDeckElementRef} key={deck} onClick={()=>{visit(deck)}}><DeckPreview deckId={deck} /></div>
					} else {
						return <div key={deck} onClick={()=>{visit(deck)}}> <DeckPreview deckId={deck} /></div>
        			}
				})}
				</div>
		</div>
		)
}
