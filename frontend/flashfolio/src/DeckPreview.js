import { useEffect, useState } from "react";
import {getDeck} from "./Calls.js";
import './FlashcardPreview.css'


export default function DeckPreview({deckId}){
	
    const [deck,setDeck] = useState(null);
    const [firstFlashcard,setFirstFlashcard] = useState("");
    
    
    useEffect(async () => {
	let res = await getDeck(deckId);
        setDeck(res);
    },[deckId]);

	useEffect(() => {
		if (deck !== null)
        		setFirstFlashcard(deck.Cards[0].FrontSide);
	}, [deck]);


    return(
        <div>
	    {deck !== null && <>
            Title: {deck.Title}
            <div className="cardPreview">{firstFlashcard}</div>
            Author: {deck.Owner}
		</>}
        </div>
    )
    
}
