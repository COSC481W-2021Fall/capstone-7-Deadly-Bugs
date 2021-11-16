import React from 'react'
import { useHistory } from 'react-router-dom';
import DeckPreview from './DeckPreview';

export default function Load() {
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
			load page
			<div class ="buttons">
					<button onClick={viewButton}>View deck 0</button>
				</div>
				<DeckPreview deckId={56715788}/>

				<div class ="buttons">
					<button onClick={homeButton}>Home</button>
				</div>

				<div class ="buttons">
					<button onClick={editButton}>Edit deck 0</button>
				</div>
		</div>
		
	)
}
