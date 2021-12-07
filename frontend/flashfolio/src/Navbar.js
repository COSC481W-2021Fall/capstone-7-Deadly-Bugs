import React, { useEffect, useState, useContext } from "react"
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import {default as MaterialSwitch} from '@material-ui/core/Switch'
import CssBaseline from '@material-ui/core/CssBaseline';
import { themeContext } from "./App.js"

/* Styling */
import "./background_styles.css"
import "./App.css"

export default function Navbar() {
	const { dark, setDark } = useContext(themeContext)
	
	useEffect(() => {
		localStorage.setItem("themeLD", dark);
	}, [dark]);

    const theme = createTheme({
		palette: {
			type: dark ? 'dark' : 'light',
			text: { primary: dark ? '#989898' : '#000', },
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
				  backgroundColor: dark ? '#292929' : '#cae1fa',
				},
			  },
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
				<MaterialSwitch checked={dark} onChange={() => setDark(!dark)} />
			</div>
		</nav>
		</ThemeProvider>
	)
}
