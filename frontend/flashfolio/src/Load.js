import React from 'react'
import { useHistory } from 'react-router-dom';

export default function Load() {
	const history = useHistory();
	
	const viewButton = () => {
		history.push("/view/0");
	  };

	return (
		<div>
			load page
			<div class ="buttons">
					<button onClick={viewButton}>View deck 0</button>
				</div>

		</div>
		
	)
}
