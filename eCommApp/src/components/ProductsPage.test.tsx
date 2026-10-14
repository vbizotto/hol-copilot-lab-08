import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import type { Product } from '../types';
import ProductsPage from './ProductsPage';

const products: Product[] = [
    {
        id: 'apple',
        name: 'Apple',
        price: 1.5,
        description: 'A crisp snack',
        image: 'apple.png',
        reviews: [],
        inStock: true,
    },
    {
        id: 'grapes',
        name: 'Grapes',
        price: 2.75,
        image: 'grapes.png',
        reviews: [],
        inStock: false,
    },
    {
        name: 'Seasonal fruit',
        price: 3,
        reviews: [],
        inStock: true,
    },
    {
        id: 'orange',
        name: 'Orange',
        price: 2,
        description: 'Sweet orange',
        reviews: [],
        inStock: true,
    },
];

const productFiles = ['apple.json', 'grapes.json', 'orange.json', 'pear.json'];

afterEach(() => {
    vi.restoreAllMocks();
});

const mockProductFetch = () => vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
    const file = String(input).split('/').pop();
    const productIndex = productFiles.indexOf(file ?? '');
    return new Response(JSON.stringify(products[productIndex]), {
        headers: { 'Content-Type': 'application/json' },
    });
});

const renderProductsPage = (addToCart = vi.fn()) => render(
    <MemoryRouter>
        <CartContext.Provider value={{ cartItems: [], addToCart, clearCart: vi.fn() }}>
            <ProductsPage />
        </CartContext.Provider>
    </MemoryRouter>
);

describe('ProductsPage', () => {
    it('throws a clear error when rendered without the cart provider', () => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

        try {
            expect(() => render(
                <MemoryRouter>
                    <ProductsPage />
                </MemoryRouter>
            )).toThrow('CartContext must be used within a CartProvider');
        } finally {
            consoleError.mockRestore();
        }
    });

    it('loads products, reflects stock status, adds available items, and accepts a review', async () => {
        mockProductFetch();
        const addToCart = vi.fn();
        renderProductsPage(addToCart);

        expect(screen.getByText('Loading products...')).toBeInTheDocument();
        expect(await screen.findByRole('heading', { name: 'Our Products' })).toBeInTheDocument();
        expect(screen.getByText('A crisp snack')).toBeInTheDocument();
        expect(screen.getByRole('img', { name: 'Apple' })).toHaveAttribute(
            'src',
            'products/productImages/apple.png'
        );
        expect(screen.getByRole('button', { name: 'Out of Stock' })).toBeDisabled();

        fireEvent.click(screen.getAllByRole('button', { name: 'Add to Cart' })[0]);
        expect(addToCart).toHaveBeenCalledWith(products[0]);

        fireEvent.click(screen.getByRole('img', { name: 'Apple' }));
        expect(screen.getByRole('heading', { name: 'Reviews for Apple' })).toBeInTheDocument();
        expect(screen.getByText('No reviews yet.')).toBeInTheDocument();
        fireEvent.change(screen.getByPlaceholderText('Your name'), {
            target: { value: 'Casey' },
        });
        fireEvent.change(screen.getByPlaceholderText('Your review'), {
            target: { value: 'Delicious' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

        expect(screen.getByText('Casey')).toBeInTheDocument();
        expect(screen.getByText('Delicious')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Close' }));
        expect(screen.queryByRole('heading', { name: 'Reviews for Apple' })).not.toBeInTheDocument();
    }, 15000);

    it('logs a product loading error and stops showing the loading state', async () => {
        const error = new Error('Network unavailable');
        vi.spyOn(globalThis, 'fetch').mockRejectedValue(error);
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

        renderProductsPage();

        await waitFor(() => {
            expect(screen.queryByText('Loading products...')).not.toBeInTheDocument();
        });

        expect(consoleError).toHaveBeenCalledWith('Error loading products:', error);
        expect(screen.getByRole('heading', { name: 'Our Products' })).toBeInTheDocument();
        expect(screen.queryByText('Apple')).not.toBeInTheDocument();
        consoleError.mockRestore();
    });

    it('logs a failed response instead of displaying an incomplete catalog', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('', { status: 503, statusText: 'Service Unavailable' })
        );
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

        renderProductsPage();

        await waitFor(() => {
            expect(screen.queryByText('Loading products...')).not.toBeInTheDocument();
        });

        expect(consoleError).toHaveBeenCalledWith(
            'Error loading products:',
            new Error('Failed to load apple.json')
        );
        expect(screen.queryByRole('button', { name: 'Add to Cart' })).not.toBeInTheDocument();
        consoleError.mockRestore();
    });
});
