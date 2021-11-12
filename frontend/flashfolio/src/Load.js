import React, { useState, useRef, useCallback } from 'react'
import { useHistory } from 'react-router-dom';
import DeckSearch from './DeckSearch'

export default function Load() {
	//////////////////////////////////////////////Erik Test Code
	const [query, setQuery] = useState('')
	const [pageNumber, setPageNumber] = useState(1)

	const {
		decks,
		hasMore,
		loading,
		error
	  } = DeckSearch(query, pageNumber)

	const observer = useRef()
    const lastDeckElementRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber(prevPageNumber => prevPageNumber + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])

  function handleSearch(e) {
    setQuery(e.target.value)
    setPageNumber(1)
  }
    /////////////////////////////////////////////////////////////Erik End
	
	const history = useHistory();
	
	const viewButton = () => {
		history.push("/view/0");
	  };
	  const homeButton = () => {
		history.push("/");
	  };
	  const editButton = () => {
		history.push("/edit/0");
	  };
	  
	return (
		<div>
			load page
			<div class ="buttons">
					<button onClick={viewButton}>View deck 0</button>
				</div>

				<div class ="buttons">
					<button onClick={homeButton}>Home</button>
				</div>

				<div class ="buttons">
					<button onClick={editButton}>Edit deck 0</button>
				</div>


		</div>
		
	)
}