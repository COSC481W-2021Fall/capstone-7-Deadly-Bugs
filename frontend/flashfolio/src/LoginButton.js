import React, { useContext } from "react";

/* External Dependencies */
import { GoogleLogin } from "react-google-login";

/* Internal Dependencies */
import { notifyUserLogin } from "./Calls.js";
import { loginContext } from "./App.js";


function LoginButton() {


	const { setLoginState } = useContext(loginContext);

	const success = async (res) => {
		setLoginState(res);
		await notifyUserLogin(res.tokenId, res.profileObj);
		localStorage.setItem("userCache", JSON.stringify(res));
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
