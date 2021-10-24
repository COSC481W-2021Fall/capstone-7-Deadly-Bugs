import React from "react";
import { GoogleLogout } from "react-google-login";

const googleClientId = "684589850875-dsqqk7pdtbuto6k2mcvgedicvdv9c63q.apps.googleusercontent.com";

function LogoutButton() {

	const success = () => {
		alert('Logged out!');
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

