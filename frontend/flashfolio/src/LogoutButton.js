import React, { useContext } from "react";

/* External Dependencies */
import { GoogleLogout } from "react-google-login";

/* Internal Dependencies */
import { loginContext } from "./App.js";

function LogoutButton() {

	const { setLoginState } = useContext(loginContext);

	const success = async () => {
		setLoginState(null);
		localStorage.removeItem("userCache");
	}

	return (
		<div>
			<GoogleLogout
				clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
				buttonText="Logout"
				onLogoutSuccess={success}
			></GoogleLogout>
		</div>
	)
}

export default LogoutButton;

