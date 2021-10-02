import React, {useState} from "react";
import Flashdeck from "./Flashdeck";

 function App() {
	 const [flashcards] = useState(FLASHCARD)
	return (
			<Flashdeck flashcards={flashcards} />
	);
}

const FLASHCARD=[{
	front:'front',
	back:'back'
},
{
	front:'front',
	back:'back'
}]

export default App;
