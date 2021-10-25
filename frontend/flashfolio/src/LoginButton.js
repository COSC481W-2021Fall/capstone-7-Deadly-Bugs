import React, { useContext } from 'react';
import { GoogleLogin } from 'react-google-login';
import { getSecret } from "./Calls.js";

import { loginContext } from "./App.js";

const googleClientId = "684589850875-dsqqk7pdtbuto6k2mcvgedicvdv9c63q.apps.googleusercontent.com";

function LoginButton() {

	
	const { setLoginState } = useContext(loginContext);

	const success = async (res) => {
		console.log('Logged in');
		setLoginState(res);
	}

	return (
		<div>
			<GoogleLogin
				clientId={googleClientId}
				buttonText="Login"
				cookiePolicy={'single_host_origin'}
				isSignedIn={false}
				onSuccess={success}
			/>
		</div>
	)
}

export default LoginButton;
