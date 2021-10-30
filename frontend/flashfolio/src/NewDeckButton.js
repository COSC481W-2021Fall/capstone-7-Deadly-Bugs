import React, { useContext, useRef } from 'react';
import { createNewDeck } from "./Calls.js";
import { loginContext } from "./App.js";
import Popup from "reactjs-popup";

import "./NewDeckButton.css"


function NewDeckButton() {

	const { loginState } = useContext(loginContext);

	const deckName = useRef();

	function newDeck() {
		console.log("New Deck ", deckName.current.value)
		createNewDeck(loginState, deckName.current.value)
	}

	return (
		<Popup trigger={<button>Create New Deck</button>} position="right center" modal>
			<div className="modal">
				<div className="header">
					Create New Deck
				</div>
				<form onSubmit={newDeck}>
					Deck Name:
					<input ref={deckName} />
					<br />
					<input type="submit" value="Create" />
				</form>
			</div>
		</Popup>
	)
}

export default NewDeckButton;

