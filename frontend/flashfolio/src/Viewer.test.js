import { render, screen } from '@testing-library/react';
import Viewer from './Viewer';
import { MemoryRouter } from 'react-router-dom';

const customRender = (ui, options) => {
    return render(ui, {wrapper: MemoryRouter, ...options})
}

test('Viewer renders properly', () => {
	customRender(<Viewer />)
    const viewerElement = screen.getByText(/DeckId:/)
    expect(viewerElement).toBeInTheDocument();
});