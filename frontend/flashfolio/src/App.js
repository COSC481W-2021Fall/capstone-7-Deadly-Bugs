import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Viewer from "./Viewer.js";
import LoginButton from "./LoginButton.js"
import { useAuth0 } from "@auth0/auth0-react";

/*
App

Main entry point for the frontend
*/
function App() {

	return (
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
	);
}

/*
Temporary Homepage

Shown when the user loads the root directory

TODO: When Hompage PBI is created, move this to it's own component.
*/
function Home() {
	const { getTokenSilently, loading, user, logout, isAuthenticated } = useAuth0();

	return (
		<div>
			Homepage placeholder
			<br />
			<LoginButton />
			{isAuthenticated ? "Authenticated!" : "Not logged in!" }
		</div>
	);
}

export default App;
