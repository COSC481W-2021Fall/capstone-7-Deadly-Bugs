
function apiURL() {
	return process.env.NODE_ENV === "development" ?
			process.env.REACT_APP_FLASH_API_DEV :
			process.env.REACT_APP_FLASH_API_PRO
}

/*
getDeck(id: int)

wrapper for getDeck/ call
*/
export async function getDeck(deckID, token="") {
	
	/* Set up and send req to get deck from backend */
	let reqOpt = {
		method: "POST",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify({'ID': Number(deckID), "Token":token}),
	}

	/* Send the Request */
	let resp = await fetch(apiURL() + "/getDeck", reqOpt);
	return resp.json();
}

/*
createNewDeck

Creates a new blank deck in the user's name
*/

export async function createNewDeck(token, deckName) {
	let reqOpt = {
		method: "POST",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify({"Token": token, "DeckName": deckName}),
	}
	console.log(reqOpt)
	let resp = await fetch(apiURL() + "/createNewDeck", reqOpt);
	console.log(resp)
	return resp.json();
}

export async function saveDeck(token, deck) {
	let reqOpt = {
		method: "POST",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify({"Token":token, "Deck": deck}),
	}

	console.log(reqOpt)

	/* Send the Request */
	let resp = await fetch(apiURL() + "/saveDeck", reqOpt);
	return resp;
}

export async function queryDecks(pageNumber, query) {
	let reqOpt = {
		method: "POST",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify({"PageNumber": pageNumber, "Query": query}),
	}
	let resp = await fetch(apiURL() + "/queryDecks", reqOpt);
	return resp.json();
}

export async function cloneDeck(token, deck) {
	let reqOpt = {
		method: "POST",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify({"Token":token, "Deck": deck}),
	}

	console.log(reqOpt)

	let resp = await fetch(apiURL() + "/cloneDeck", reqOpt);
	console.log(resp)
	return resp.json();
}
export async function notifyUserLogin(token, profileObj) {
	let reqOpt = {
		method: "POST",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify({"Token": token, "NickName": profileObj.name, "ProfilePicture":profileObj.imageUrl}),
	}

	let resp = await fetch(apiURL() + "/userLogin", reqOpt);
}

export async function getUser(userID, includePrivate=false, token="") {
	let reqOpt = {
		method: "POST",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify({"ID":userID, "Private":includePrivate, "Token": token}),
	}

	let resp = await fetch(apiURL() + "/getUser", reqOpt);
	return resp.json();
}

