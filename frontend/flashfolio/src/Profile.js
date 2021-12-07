import React, { useEffect, useContext, useState } from "react"

/* External Dependencies */
import { useParams, useHistory } from "react-router-dom"

/* Internal Dependencies */
import DeckPreview from "./DeckPreview.js"
import { getUser, getDeck } from "./Calls.js"
import { loginContext } from "./App.js"

/* Styling */
import "./Viewer.css"

export default function Profile() {

	const { loginState } = useContext(loginContext)
	const { userId } = useParams()
	const [user, setUser] = useState(null)
	const [userDecks, setUserDecks] = useState([])
	const history = useHistory()

	// Get all user info for the user associated with the Id in the url.
	useEffect(() => {
		async function storeInfo() {
			let owner = await getUser(userId)
			setUser(owner)
		}
		storeInfo()
	}, [userId])

	// Get all valid decks to be shown based on loginStatus.
	useEffect(() => {
		async function deckInfo() {
			if (user !== null) {
				let decks = []
				for (let fc of user.OwnedDecks) {
					let deck = await getDeck(Number(fc), loginState !== null ? loginState.tokenId : "")
					if (deck !== null) {
						decks.push(deck)
					}
				}
				setUserDecks(decks)
			}
		}
		deckInfo()
	}, [userId, loginState, user])

	return (
		<div>
			<div className="profile">
				<img src={user === null ? "" : user.ProfilePicture} alt="" />
				<div className="profileText">
					{user === null ? "" : user.NickName + "'s Profile Page"} <br />
				</div>
			</div>
			<hr />
			<div className="flash-grid">
				{user === null ?
					<> No Existing User Specified. </> :
					<>
						{userDecks.map(fc => {
							return <div onClick={() => { history.push("/view/" + fc.ID) }}><DeckPreview deckId={fc.ID} /></div>
						})}
					</>
				}
			</div>
		</div>
	)
}
