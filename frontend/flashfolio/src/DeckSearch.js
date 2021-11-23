import { useEffect, useState } from "react"

/* Internal Dependencies */
import { queryDecks } from "./Calls.js"

export default function DeckSearch(query, pageNumber, initial = []) {
	const [loading, setLoading] = useState(true)
	const [decks, setDecks] = useState([])
	const [hasMore, setHasMore] = useState(false)

	useEffect(() => {
		setDecks(initial)
		// Bad dependencies, but fixing breaks, so ignore.
		// eslint-disable-next-line
	}, [query])

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true)
			let res = await queryDecks(pageNumber, query)
			setDecks(decks => {
				return [...new Set([...decks, ...res.DeckIDs])]
			})
			setHasMore(res.RemainingDecks)
			setLoading(false)
		}
		fetchData()
	}, [query, pageNumber])

	return { loading, decks, hasMore }
}
