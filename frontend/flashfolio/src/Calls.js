
function apiURL() {
	return process.env.NODE_ENV === "development" ?
			process.env.REACT_APP_FLASH_API_DEV :
			process.env.REACT_APP_FLASH_API_PRO
}

/*
getDeck(id: int)

wrapper for getDeck/ call
*/
export async function getDeck(deckID) {
	
	/* Set up and send req to get deck from backend */
	let reqOpt = {
		method: "POST",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify({'ID': Number(deckID)}),
	}

	/* Send the Request */
	let resp = await fetch(apiURL() + "/getDeck", reqOpt);
	return resp.json();
}

/*
getSecret

just a temp method used to test user auth
*/
export async function getSecret(token) {
	let reqOpt = {
		method: "POST",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify({'Token': token}),
	}

	let resp = await fetch(apiURL() + "/getSecret", reqOpt);
	return resp.json();
}

