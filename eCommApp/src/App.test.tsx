import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

afterEach(() => {
    vi.restoreAllMocks();
});

describe('App routes', () => {
    it.each([
        ['/', 'Welcome to the The Daily Harvest!'],
        ['/login', 'Admin Login'],
        ['/admin', 'Welcome to the admin portal.'],
        ['/cart', 'Your Cart'],
    ])('renders the page registered for %s', (path, expectedText) => {
        render(
            <MemoryRouter initialEntries={[path]}>
                <App />
            </MemoryRouter>
        );

        expect(screen.getByRole('heading', { name: expectedText })).toBeInTheDocument();
    });

    it('renders the product catalog route', async () => {
        vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
            const file = String(input).split('/').pop() ?? 'product.json';
            const id = file.replace('.json', '');
            return new Response(JSON.stringify({
                id,
                name: id,
                price: 1.5,
                reviews: [],
                inStock: true,
            }), { headers: { 'Content-Type': 'application/json' } });
        });

        render(
            <MemoryRouter initialEntries={['/products']}>
                <App />
            </MemoryRouter>
        );

        expect(await screen.findByRole('heading', { name: 'Nossos produtos' })).toBeInTheDocument();
    });
});
