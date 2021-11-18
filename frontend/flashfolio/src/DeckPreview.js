import React, { useEffect, useState, useContext } from "react";

/* Internal Dependencies */
import { getDeck } from "./Calls.js";
import { loginContext } from "./App.js";

/* Styling */
import "./FlashcardPreview.css";


export default function DeckPreview({deckId}){
	
    const [deck,setDeck] = useState(null);
    const [firstFlashcard,setFirstFlashcard] = useState("");

	const {loginState} = useContext(loginContext);

    useEffect(async () => {
		let res = await getDeck(deckId, (loginState !== null?loginState.tokenId:""));
		setDeck(res);
    },[deckId, loginState]);

	useEffect(() => {
		if (deck !== null)
        	setFirstFlashcard(deck.Cards[0].FrontSide);
	}, [deck]);


    return(
        <div>
	    {deck !== null && <>
            Title: {deck.Title}
            <div className="card_preview">{firstFlashcard}</div>
            Author: {deck.Owner}
		</>}
        </div>
    )
    
}
