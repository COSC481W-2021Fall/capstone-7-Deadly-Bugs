import React from "react";

/* Internal Dependencies */
import Flashcard from "./Flashcard.js";

export default function Flashdeck({flashcards}) {
	return (
		<div>
			{flashcards.map(flashcard =>{return <Flashcard flashcard={flashcard}/>})}
		</div>
	)
}
