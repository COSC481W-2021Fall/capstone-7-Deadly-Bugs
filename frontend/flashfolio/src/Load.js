import React from 'react'
import { useHistory } from 'react-router-dom';
import Flashcard from "./Flashcard";
import "./Viewer.css";

export default function Load() {

	const arrayOfCards = [
		{ FrontSide: "1", BackSide: "1B" },
		{ FrontSide: "2", BackSide: "2B" },
		{ FrontSide: "3", BackSide: "3B" },
		{ FrontSide: "4", BackSide: "4B" },
		{ FrontSide: "5", BackSide: "5B" },
		{ FrontSide: "6", BackSide: "6B" },
		{ FrontSide: "7", BackSide: "7B" },
		{ FrontSide: "8", BackSide: "8B" },
		{ FrontSide: "9", BackSide: "9B" },
		{ FrontSide: "10", BackSide: "10B" },
	  ];
	  
	const history = useHistory();
	
	const viewButton = () => {
		history.push("/view/0");
	  };
	  const homeButton = () => {
		history.push("/");
	  };
	  const editButton = () => {
		history.push("/edit/0");
	  };
	return (
		<div>
			Discover<br/>
			<div class ="buttons">
					<button onClick={viewButton}>View deck 0</button>
				</div>

				<div class ="buttons">
					<button onClick={homeButton}>Home</button>
				</div>

				<div class ="buttons">
					<button onClick={editButton}>Edit deck 0</button>
				</div>
	
				<div class="flash-grid">
					{arrayOfCards.map(fc => {
						return <div><Flashcard flashcard={fc} /></div>
					})}
				</div>
			)
		</div>
		
	)
}