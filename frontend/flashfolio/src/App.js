import React, { useEffect, createContext, useState } from "react";

/* External Dependencies */
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

/* Internal Dependencies */
import Viewer from "./Viewer.js";
import Load from "./Load.js";
import Profile from "./Profile.js";
import Navbar from "./Navbar.js";
import Home from "./Home.js";

/* Styling */
import "./App.css";

/*
App

Main entry point for the frontend
*/

export const loginContext = createContext(null)

function App() {

	const [loginState, setLoginState] = useState(null);

	const [loadedAuthState, setLoadedAuthState] = useState(false);

	/*
	const { signIn, loaded } = useGoogleLogin({
		onSuccess: (res) => {
				setLoginState(res);
				console.log("signed in!");
				setLoadedAuthState(true);
			},
		onFailure: (res) => {
			setLoadedAuthState(true);
		},
		clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
		onAutoLoadFinished: (res) => {
			console.log("Autoload Finished")
		},
		isSignedIn: true,
		accessType: "offline",
	});
	*/

	useEffect(() => {
		setLoginState(JSON.parse(localStorage.getItem("userCache")));
		setLoadedAuthState(true);
	},[]);

	return (
		<loginContext.Provider value={{loginState, setLoginState, loadedAuthState}}>
		<Navbar />
		<Router>
			{/* Router to create a multi-page application */}
			<Switch>
			<Route path="/view/:deckId">
				<Viewer />
			</Route>
			<Route path="/edit/:deckId">
				<Viewer viewMode="edit"/>
			</Route>
			<Route exact path="/">
				<Home />
			</Route>
			<Route path="/load">
				<Load />
			</Route>
			<Route path="/profile/:userId">
				<Profile />
			</Route>
			</Switch>
		</Router>
		</loginContext.Provider>
	);
}

export default App;
