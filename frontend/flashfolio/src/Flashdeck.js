import React from 'react'
import Flashcard from './Flashcard'

export default function Flashdeck({flashcards}) {
    return (
        <div>
            {flashcards.map(flashcard =>{return <Flashcard flashcard={flashcard}/>})}
        </div>
    )
}
