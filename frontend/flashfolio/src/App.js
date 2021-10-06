import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Viewer from "./Viewer.js";


function App() {

	return (
		<Router>
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

function Home() {
	return (
		<div>
			Homepage placeholder
		</div>
	);
}

export default App;
