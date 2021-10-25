import React, { useContext } from "react";
import { GoogleLogout } from "react-google-login";

import { loginContext } from "./App.js";

const googleClientId = "684589850875-dsqqk7pdtbuto6k2mcvgedicvdv9c63q.apps.googleusercontent.com";

function LogoutButton() {

	const { setLoginState } = useContext(loginContext);

	const success = async () => {
		console.log('Logged out');
		setLoginState(null);
	}

	return (
		<div>
			<GoogleLogout
				clientId={googleClientId}
				buttonText="Logout"
				onLogoutSuccess={success}
			></GoogleLogout>
		</div>
	)
}

export default LogoutButton;

