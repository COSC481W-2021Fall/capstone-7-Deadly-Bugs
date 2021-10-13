import Flashcard from "./Flashcard";
import { render, screen, fireEvent } from '@testing-library/react';

test('Clicking card is possible', () => {
    var testFlash = {
        frontSide: 'front',
        backSide: 'back'
    };

    render(<Flashcard flashcard = {testFlash} />);
    const clicked = fireEvent.click(screen.getByTestId('card'));
    expect(clicked);
});