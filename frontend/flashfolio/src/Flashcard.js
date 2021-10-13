import React, {useState} from 'react'
import './Flashcard.css'

export default function Flashcard({flashcard}) {
	const [flip, setFlip] = useState(false);
	return (
		<div data-testid = "card" onClick={() => setFlip(!flip)} class="card">
			{flip ? flashcard.BackSide : flashcard.FrontSide}	
		</div>
	)
}
