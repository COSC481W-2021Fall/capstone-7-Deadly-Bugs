import React, { createContext, useState, useContext } from "react";
import LoginButton from "./LoginButton.js"
import LogoutButton from "./LogoutButton.js"

export const loginContext = createContext(null)


export default function Home() {
	const [loginState, setLoginState] = useState(null);

	const { signIn, loaded } = useGoogleLogin({
		onSuccess: (res) => {
				setLoginState(res);
				console.log("signed in!");
			},
		clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
		isSignedIn: true,
		accessType: "offline",
	});

	console.log("Hello!", process.env.REACT_APP_GOOGLE_CLIENT_ID)

	const { loginState } = useContext(loginContext);

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
					If you would like to create a deck, please click "Sign Up." Otherwise, to peruse
					our large variety of public decks, hit "Discover."
				</div>
				<div class ="buttons">
					<button>Discover</button>
					{/*<button>Sign Up</button>*/}
					{ loginState === null ?
						<LoginButton /> :
						<LogoutButton />}
					{/*<UserInfoPreview />*/}
				</div>
			</div>
		</div>
	);
}