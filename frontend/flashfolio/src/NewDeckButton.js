import React, { useContext, useRef } from "react"

/* External Dependencies */
import Popup from "reactjs-popup"
import { useHistory } from "react-router-dom"

/* Internal Dependencies */
import { createNewDeck } from "./Calls.js"
import { loginContext, themeContext } from "./App.js"

/* Styling */
import "./NewDeckButton.css"


function NewDeckButton() {

	const { loginState } = useContext(loginContext)
	const { dark } = useContext(themeContext)
	const deckName = useRef()
	const history = useHistory()

	async function newDeck() {
		let resp = await createNewDeck(loginState.tokenId, deckName.current.value)
		history.push("/edit/" + resp.ID)

	}

	return (
		<Popup trigger={<button>Create New Deck</button>} position="right center" modal>
			<div className="modal" data-theme={dark ? "dark" : "light"}>
				<div className="header">
					Create New Deck
				</div>
				Deck Name:
				<input ref={deckName} />
				<br />
				<button onClick={newDeck}>Create</button>
			</div>
		</Popup>
	)
}

export default NewDeckButton

