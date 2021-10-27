import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Viewer from "./Viewer.js";
import './App.css'


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
					If you would like to create a deck, please click "Create an account". Otherwise, to peruse
					our large variety of public decks, hit "WhateverThisIsCalled."
				</div>
				<div class ="buttons">
					<button>Discover</button>
					<button>Sign Up</button>
				</div>
			</div>
		</div>
	);
}

export default App;
