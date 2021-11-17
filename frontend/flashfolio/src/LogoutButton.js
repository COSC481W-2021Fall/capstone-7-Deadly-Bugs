import React, { useContext } from "react";
import { GoogleLogout } from "react-google-login";

import { loginContext } from "./App.js";

function LogoutButton() {

	const { setLoginState } = useContext(loginContext);

	const success = async () => {
		console.log('Logged out');
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

