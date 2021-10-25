import React, { createContext, useState } from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Viewer from "./Viewer.js";
import LoginButton from "./LoginButton.js"
import LogoutButton from "./LogoutButton.js"
import UserInfoPreview from "./UserInfoPreview.js"

import { useGoogleLogin } from "react-google-login";

/*
App

Main entry point for the frontend
*/

export const loginContext = createContext(null)

function App() {

	const [loginState, setLoginState] = useState(null);

	const { signIn, loaded } = useGoogleLogin({
		onSuccess: (res) => {
				setLoginState(res);
				console.log("signed in!");
			},
		clientId: "684589850875-dsqqk7pdtbuto6k2mcvgedicvdv9c63q.apps.googleusercontent.com",
		isSignedIn: true,
		accessType: "offline",
	});

	return (
		<loginContext.Provider value={{loginState, setLoginState}}>
		<Router>
			{/* Router to create a multi-page application */}
			<Switch>
			<Route path="/view/:deckId">
				<Viewer />
			</Route>
			<Route path="/edit/:deckId">
				<Viewer viewMode="edit"/>
			</Route>
			<Route path="/">
				<Home />
			</Route>
			</Switch>
		</Router>
		</loginContext.Provider>
	);
}

/*
Temporary Homepage

Shown when the user loads the root directory

TODO: When Hompage PBI is created, move this to it's own component.
*/
function Home() {
	return (
		<div>
			<UserInfoPreview />
			Homepage placeholder
			<LoginButton />
			<LogoutButton />
		</div>
	);
}

export default App;
