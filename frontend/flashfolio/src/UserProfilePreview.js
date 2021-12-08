import React, { useEffect, useState, useContext } from "react";

/* Internal Dependencies */
import { getUser } from "./Calls.js";
import "./UserProfilePreview.css"

export default function UserProfilePreview({userId, showName=true, size=50}) {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			let res = await getUser(userId);
			setUser(res)
		}
		fetchData()
	}, [userId]);

	const styleObj = {
		width: size,
	}
	
	return (
		<div>
		<a href={"/profile/"+userId}>
			<div className="proprev">
				<img style={styleObj} src={user === null ? "" : user.ProfilePicture} alt={user === null ? "" : user.NickName} />
				{showName && <div className="proprev_text">
					{user === null ? "" : user.NickName}
				</div>}
			</div>
		</a>
		</div>
	)
}

