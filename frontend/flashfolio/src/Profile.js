import React, { useEffect, useContext, useState } from "react";

/* External Dependencies */
import { useParams, useHistory } from "react-router-dom";

/* Internal Dependencies */
import DeckPreview from "./DeckPreview.js";
import { getUser } from "./Calls.js";
import { loginContext } from "./App.js";

/* Styling */
import "./Viewer.css";

export default function Profile() {

	const { loginState } = useContext(loginContext);
	const { userId } = useParams();
	const [user, setUser] = useState(null);
	const history = useHistory();

	// Get all user info for the user associated with the Id in the url.
	useEffect(() => {
		async function storeInfo()
		{
			let owner = await getUser(userId);
			console.log("Owner: " + owner.NickName);
			setUser(owner);
		}
		storeInfo();
	}, [userId]);

	return (
		<div>
			<div className="profile">
				<img src={user === null ? "" : user.ProfilePicture} alt="" />
				<div className="profileText">
					{user === null ? "" : user.NickName + "'s Profile Page"} <br/>
					{userId === null ? "" : "User Id: " + userId }<br/>
				</div>
			</div>
			<hr/>
			<div className="flash-grid">
				{user === null ? 
				<> No Existing User Specified. </> :
				<>
					{user.OwnedDecks.map(fc => {
						return <div onClick={()=>{history.push("/view/"+fc)}}><DeckPreview deckId={fc} /></div>
					})}
				</>
				}
			</div>
		</div>	
	)
}
