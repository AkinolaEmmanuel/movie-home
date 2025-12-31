import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest';

describe('App Component', () => {
    it('renders the search bar correctly', () => {
        render(<App />);
        const inputElement = screen.getByPlaceholderText(/Search for your movie choice/i);
        expect(inputElement).toBeTruthy();
    });

    it('updates input value on change', () => {
        render(<App />);
        const inputElement = screen.getByPlaceholderText(/Search for your movie choice/i) as HTMLInputElement;
        fireEvent.change(inputElement, { target: { value: 'Inception' } });
        expect(inputElement.value).toBe('Inception');
    });
});