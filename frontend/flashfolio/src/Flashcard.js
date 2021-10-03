import React from 'react'
import './Flashcard.css'

export default function Flashcard({flashcard}) {
	return (
		<div class='card'>
			{flashcard.FrontSide}
		</div>
	)
}
