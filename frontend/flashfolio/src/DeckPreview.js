import { useEffect, useState, useContext } from "react";
import {getDeck} from "./Calls.js";
import './FlashcardPreview.css'

import {loginContext} from "./App.js";

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
