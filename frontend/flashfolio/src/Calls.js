
export const API_URL = "http://localhost:1337"

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
	let resp = await fetch(API_URL + "/getDeck", reqOpt);
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

	let resp = await fetch(API_URL + "/getSecret", reqOpt);
	return resp.json();
}

