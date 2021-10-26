import React, { useContext } from 'react';
import { GoogleLogin } from 'react-google-login';
import { getSecret } from "./Calls.js";

import { loginContext } from "./App.js";


function LoginButton() {

	
	const { setLoginState } = useContext(loginContext);

	const success = async (res) => {
		console.log('Logged in');
		setLoginState(res);
	}

	return (
		<div>
			<GoogleLogin
				clientId={process.env.GOOGLE_CLIENT_ID}
				buttonText="Login"
				cookiePolicy={'single_host_origin'}
				isSignedIn={false}
				onSuccess={success}
			/>
		</div>
	)
}

export default LoginButton;
