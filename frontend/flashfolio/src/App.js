import React, {useState, useEffect} from "react";
import Flashcard from "./Flashcard";

function App() {

	const [flashcard, setFlashcard] = useState("");

	useEffect(() => {

		const reqOpt = {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: {'ID': 0}
		}

		fetch('http://localhost:1337/getDeck', reqOpt)
			.then(resp => resp.json())
			.then(data => setFlashcard(data))

	}, [])

	return (
			<Flashcard flashcard={flashcard} />
	);
}

export default App;
