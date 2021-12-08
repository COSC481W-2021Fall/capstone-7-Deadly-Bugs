import React, { useEffect, useState, useContext } from "react"
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import {default as MaterialSwitch} from '@material-ui/core/Switch'
import CssBaseline from '@material-ui/core/CssBaseline';
import { loginContext, themeContext } from "./App.js"
import UserProfilePreview from "./UserProfilePreview.js"

/* Styling */
import "./background_styles.css"
import "./App.css"

export default function Navbar() {
	const { dark, setDark } = useContext(themeContext)
	const { loginState } = useContext(loginContext)

	useEffect(() => {
		localStorage.setItem("themeLD", dark);
	}, [dark]);

    const theme = createTheme({
		palette: {
			type: dark ? 'dark' : 'light',
			text: { primary: dark ? '#fff' : '#000', },
    		primary: {
				main: '#24305E',
			},
    		secondary: {
     		 	main: '#dd5f5f',
    		},
        },
		overrides: {
			MuiCssBaseline: {
			  '@global': {
				body: {
				  backgroundColor: dark ? '#292929' : '#738adb',
				},
			  },
			},
		},
    })

	return (
		<ThemeProvider theme={theme}>
		<CssBaseline />
		<nav className="navbar">
			<div className="brand-title"><a href="/">Flashfolio</a></div>
			<div className="navbar-links">
				<ul>
					<li><a href="/load">Load Deck</a></li>
					<li>{loginState === null ? "" : <UserProfilePreview userId={loginState.googleId} showName={false} size={30} />}</li>
				</ul>
				<MaterialSwitch checked={dark} onChange={() => setDark(!dark)} />
			</div>
		</nav>
		</ThemeProvider>
	)
}
