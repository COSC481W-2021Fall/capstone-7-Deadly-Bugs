import React, { useEffect, createContext, useState, useContext } from "react";
import {BrowserRouter as Router, Route, Switch, useHistory } from "react-router-dom";
import Viewer from "./Viewer.js";
import Load from "./Load.js";
import Profile from "./Profile.js";
import LoginButton from "./LoginButton.js"
import LogoutButton from "./LogoutButton.js"
import UserInfoPreview from "./UserInfoPreview.js"
import './App.css'

import NewDeckButton from "./NewDeckButton.js"

import { useGoogleLogin } from "react-google-login";

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

	console.log("Hello!", process.env.REACT_APP_GOOGLE_CLIENT_ID)

	return (
		<loginContext.Provider value={{loginState, setLoginState, loadedAuthState}}>
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

/*
Temporary Homepage

Shown when the user loads the root directory

TODO: When Hompage PBI is created, move this to it's own component.
*/
function Home() {

	const { loginState } = useContext(loginContext);

	const history = useHistory();
	
	const loadButton = () => {
		history.push("/load");
	  };
	

	return (
		<div class="container">
			<div class="left">
				<div class="logoCard">
    				<h1 class="logo">FLASH</h1>
  				</div>
  				<div class="slide">
    				<h1 class="logo">FOLIO</h1>
  				</div>
			</div>
			
			<div class="right">
				<div class="intro">
					Hi! We're Flashfolio! A flashcard website you can use to study to your heart's desire.
					If you would like to create a deck, please click "Log In." Otherwise, to peruse
					our large variety of public decks, hit "Discover."
				</div>
				<div class ="buttons">
					<button onClick={loadButton}>Discover</button>
					{/*<button>Sign Up</button>*/}
					{ loginState === null ?
						<LoginButton /> :
						<><LogoutButton />
						<NewDeckButton />
						</>}
					{/*<UserInfoPreview />*/}
				</div>
			</div>
		</div>
	);
}

export default App;
