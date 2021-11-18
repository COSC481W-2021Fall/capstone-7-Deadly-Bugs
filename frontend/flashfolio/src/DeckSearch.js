import React, { useEffect, useState } from 'react'
import { queryDecks } from "./Calls.js";

export default function DeckSearch(query, pageNumber, initial=[]) {
	const [loading, setLoading] = useState(true)
	const [decks, setDecks] = useState([])
	const [hasMore, setHasMore] = useState(false)

	useEffect(() => {
		setDecks(initial);
	}, [query]);

	useEffect(async () => {
		setLoading(true);
		let res = await queryDecks(pageNumber, query);
		setDecks(decks => {
			return [...new Set([...decks, ...res.DeckIDs])];
		});
		setHasMore(res.RemainingDecks);
		setLoading(false);
		console.log("getting more!", pageNumber)
	}, [query, pageNumber]);

	return { loading, decks, hasMore };
}
