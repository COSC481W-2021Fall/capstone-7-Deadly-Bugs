import React, { useEffect, useState } from "react"
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import {default as MaterialSwitch} from '@material-ui/core/Switch'
import CssBaseline from '@material-ui/core/CssBaseline';

/* Styling */
import "./background_styles.css"
import "./App.css"


export default function Navbar() {
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

	return (
		<ThemeProvider theme={theme}>
		<CssBaseline />
		<nav className="navbar">
			<div className="brand-title">Flashfolio</div>
			<div className="navbar-links">
				<ul>
					<li><a href="/">Home</a></li>
					<li><a href="/load">Load Deck</a></li>
				</ul>
			</div>
			<div>
			<MaterialSwitch checked={dark} onChange={() => setDark(!dark)} />
			</div>
		</nav>
		</ThemeProvider>
	)
}
