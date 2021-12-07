import React, { useContext, useEffect } from "react"

/* External Dependencies */
import { useHistory } from "react-router-dom"

/* Internal Dependencies */
import LoginButton from "./LoginButton.js"
import LogoutButton from "./LogoutButton.js"
import NewDeckButton from "./NewDeckButton.js"
import { loginContext, themeContext } from "./App.js"

export default function Home() {
	const { loginState } = useContext(loginContext)
	const { dark } = useContext(themeContext)
	const history = useHistory()

	const loadButton = () => {
		history.push("/load")
	}

	const profileButton = () => {
		if (loginState === null)
			history.push("/profile/")
		else
			history.push("/profile/" + loginState.googleId)
	}

	return (
		<div class="container" data-theme={dark ? "dark" : "light"}>
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
					Hi! We&#39;re Flashfolio! A flashcard website you can use to study to your heart&#39;s desire.
					If you would like to create a deck, please click "Log In." Otherwise, to peruse
					our large variety of public decks, hit "Discover."
				</div>
				<div class="buttons">
					<button onClick={loadButton}>Discover</button>
					{/*<button>Sign Up</button>*/}
					{loginState === null ?
						<LoginButton /> :
						<><LogoutButton />
							<NewDeckButton />
						</>}
					{/*<UserInfoPreview />*/}
					<button onClick={profileButton}>Profile</button>
				</div>
			</div>
		</div>
	)
}
