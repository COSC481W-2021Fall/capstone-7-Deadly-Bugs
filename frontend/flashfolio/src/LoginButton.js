import React from 'react';
import { GoogleLogin } from 'react-google-login';
import { getSecret } from "./Calls.js";


const googleClientId = "684589850875-dsqqk7pdtbuto6k2mcvgedicvdv9c63q.apps.googleusercontent.com";


function LoginButton() {

	const success = async (res) => {
		console.log('Logged in', res);
		let secret = await getSecret(res.tokenId);
		alert(secret.Secret)
	}

	return (
		<div>
			<GoogleLogin
				clientId={googleClientId}
				buttonText="Login"
				cookiePolicy={'single_host_origin'}
				isSignedIn={true}
				onSuccess={success}
			/>
		</div>
	)
}

export default LoginButton;
