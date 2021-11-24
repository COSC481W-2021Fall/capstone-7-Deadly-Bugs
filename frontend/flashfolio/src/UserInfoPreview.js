import React, { useContext } from "react"

/* Internal Dependencies */
import { loginContext } from "./App.js"

function UserInfoPreview() {

	const { loginState } = useContext(loginContext)

	return (
		<div>
			{loginState === null ?
				<>Not Signed in!</> :
				<>
					Signed in as {loginState.profileObj.name}
				</>
			}
		</div>
	)
}

export default UserInfoPreview
