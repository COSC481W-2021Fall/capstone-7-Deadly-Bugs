import { render, screen } from '@testing-library/react';
import App from './App';

/*
Temporary test to check if homepage has loaded!
*/
test('Homepage renders properly', () => {
	render(<App />);
	const linkElement = screen.getByText(/Homepage/i);
	expect(linkElement).toBeInTheDocument();
});
