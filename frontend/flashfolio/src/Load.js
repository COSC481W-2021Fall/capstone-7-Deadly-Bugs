import React from 'react'
import { useHistory } from 'react-router-dom';
import './background_styles.css'


export default function Load() {
	const history = useHistory();
	
	const viewButton = () => {
		history.push("/view/0");
	  };

	return (
		<div>
			<nav class="navbar">
			<div class="brand-title">Flashfolio</div>
			<div class="navbar-links">
			<ul>
				<li><a href="/">Home</a></li>
			</ul>
			</div>

		  </nav>
			load page
			<div class ="buttons">
					<button onClick={viewButton}>View deck 0</button>
				</div>

		</div>
		
	)
}