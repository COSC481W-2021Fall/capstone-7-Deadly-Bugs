import { render, screen } from "@testing-library/react"

/* Internal Dependencies */
import App from "./App.js"

/*
Temporary test to check if homepage has loaded!
*/
test("Homepage renders properly", () => {
	render(<App />)
	const linkElement = screen.getByText(/Homepage/i)
	expect(linkElement).toBeInTheDocument()
})
