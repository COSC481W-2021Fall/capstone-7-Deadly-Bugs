import React, { useContext } from 'react';
import { GoogleLogin } from 'react-google-login';
import { getUser, notifyUserLogin } from "./Calls.js";

import { loginContext } from "./App.js";


function LoginButton() {


	const { setLoginState } = useContext(loginContext);

	const success = async (res) => {
		console.log('Logged in');
		setLoginState(res);
		await notifyUserLogin(res.tokenId);
	}

	return (
		<div>
			<GoogleLogin
				clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
				buttonText="Login"
				cookiePolicy={'single_host_origin'}
				isSignedIn={false}
				onSuccess={success}
			/>
		</div>
	)
}

export default LoginButton;
