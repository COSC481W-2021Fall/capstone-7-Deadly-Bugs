import { useEffect, useState } from "react";
import {getDeck} from "./Calls.js";
import './Flashcard.css'


export default function DeckPreview(deckId){
	
    const [deck,setDeck] = useState("");
    const [firstFlashcard,setFirstFlashcard] = useState("");
    
    
    useEffect(async () => {
        setDeck(await getDeck(deckId));	
        setFirstFlashcard(deck.Cards[0].FrontSide);
    },[deckId]);


    return(
        <div>
            Author: {deck.Owner}
            Title: {deck.Title}
			DeckId: {deckId}
            <div class="card">{firstFlashcard}</div>
        </div>
    )
    
}