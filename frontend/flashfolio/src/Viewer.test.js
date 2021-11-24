import { render, screen } from "@testing-library/react"

/* External Dependencies */
import { MemoryRouter } from "react-router-dom"

/* Internal Dependencies */
import Viewer from "./Viewer.js"

const customRender = (ui, options) => {
	return render(ui, { wrapper: MemoryRouter, ...options })
}

test("Viewer renders properly", () => {
	customRender(<Viewer />)
	const viewerElement = screen.getByText(/DeckId:/)
	expect(viewerElement).toBeInTheDocument()
})