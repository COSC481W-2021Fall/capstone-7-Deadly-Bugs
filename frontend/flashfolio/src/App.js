import React, { useEffect, createContext, useState } from "react"

/* External Dependencies */
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import {default as MaterialSwitch} from '@material-ui/core/Switch'
import CssBaseline from '@material-ui/core/CssBaseline';

/* Internal Dependencies */
import Viewer from "./Viewer.js"
import Load from "./Load.js"
import Profile from "./Profile.js"
import Navbar from "./Navbar.js"
import Home from "./Home.js"

/* Styling */
import "./App.css"

/*
App

Main entry point for the frontend.
*/

/* Context provides user info to child components */
export const loginContext = createContext(null)

function App() {
	const storedDarkMode = localStorage.getItem("themeLD") === "true";
	const [dark, setDark] = useState(storedDarkMode)

	useEffect(() => {
		localStorage.setItem("themeLD", dark);
	  }, [dark]);
	  

    const theme = createTheme({
        palette: {
			type: dark ? 'dark' : 'light',
    		primary: {
				main: '#aa2e25',
			},
    		secondary: {
     		 main: '#b9f6ca',
    		},
        },
    })
	const [loginState, setLoginState] = useState(null)

	const [loadedAuthState, setLoadedAuthState] = useState(false)

	/* This may be of use later -- as such leave it here commented.
	const { signIn, loaded } = useGoogleLogin({
		onSuccess: (res) => {
				setLoginState(res)
				console.log("signed in!")
				setLoadedAuthState(true)
			},
		onFailure: (res) => {
			setLoadedAuthState(true)
		},
		clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
		onAutoLoadFinished: (res) => {
			console.log("Autoload Finished")
		},
		isSignedIn: true,
		accessType: "offline",
	})
	*/

	/* This use effect is executed at each render to
	 * grab the latest user info and inform other components
	 * that the Auth information is loaded. */
	useEffect(() => {
		setLoginState(JSON.parse(localStorage.getItem("userCache")))
		setLoadedAuthState(true)
	}, [])

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
		<loginContext.Provider value={{ loginState, setLoginState, loadedAuthState }}>
			<Navbar />
			<MaterialSwitch checked={dark} onChange={() => setDark(!dark)} />
			<Router>
				{/* Router to create a multi-page application */}
				<Switch>
					<Route path="/view/:deckId">
						<Viewer />
					</Route>
					<Route path="/edit/:deckId">
						<Viewer viewMode="edit" />
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
    </ThemeProvider>
	)
}

export default App
