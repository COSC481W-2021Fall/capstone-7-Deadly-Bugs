import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Viewer from "./Viewer.js";


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
	return (
		<div>
			Homepage placeholder
		</div>
	);
}

export default App;
