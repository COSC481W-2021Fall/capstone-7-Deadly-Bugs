import React, { useEffect, useContext, useState } from 'react'
import { useParams } from "react-router-dom";
import "./Viewer.css";
import { getUser } from "./Calls.js";
import { loginContext } from "./App.js";
import Flashcard from "./Flashcard";

export default function Profile() {

	const { loginState } = useContext(loginContext);
	let { userId } = useParams();
	const [user, setUser] = useState(null);

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
			{/*If no login or login != to userId in url, only show user specific public decks*/}
			{loginState === null || loginState.googleId !== userId ?
			<>
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
							return <div><Flashcard flashcard={fc}/></div>
						})}
					</>
					}
				</div>
			</> :
			<> {/* Else, show all decks associated with the userId.*/}
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
							return <div><Flashcard flashcard={fc}/></div>
						})}
					</>
					}
				</div>
			</>
			}
		</div>	
	)
}