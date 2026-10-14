import { fireEvent, render, screen } from '@testing-library/react';
import { useContext } from 'react';
import { describe, expect, it } from 'vitest';
import { CartProvider, CartContext } from './CartContext';
import type { Product } from '../types';

const product: Product = {
    id: 'apple',
    name: 'Apple',
    price: 1.5,
    image: 'apple.png',
    reviews: [],
    inStock: true,
};

const CartControls = () => {
    const cart = useContext(CartContext);

    if (!cart) {
        throw new Error('CartControls must be used within a CartProvider');
    }

    return (
        <>
            <button onClick={() => cart.addToCart(product)}>Add apple</button>
            <button onClick={cart.clearCart}>Clear cart</button>
            <output data-testid="cart-items">
                {cart.cartItems.map(item => `${item.name}:${item.quantity}`).join(',')}
            </output>
        </>
    );
};

describe('CartProvider', () => {
    it('adds a product to an empty cart with quantity one', () => {
        render(
            <CartProvider>
                <CartControls />
            </CartProvider>
        );

        fireEvent.click(screen.getByRole('button', { name: 'Add apple' }));

        expect(screen.getByTestId('cart-items')).toHaveTextContent('Apple:1');
    });

    it('increments the quantity when the same product is added again', () => {
        render(
            <CartProvider>
                <CartControls />
            </CartProvider>
        );

        fireEvent.click(screen.getByRole('button', { name: 'Add apple' }));
        fireEvent.click(screen.getByRole('button', { name: 'Add apple' }));

        expect(screen.getByTestId('cart-items')).toHaveTextContent('Apple:2');
    });

    it('removes all products when the cart is cleared', () => {
        render(
            <CartProvider>
                <CartControls />
            </CartProvider>
        );

        fireEvent.click(screen.getByRole('button', { name: 'Add apple' }));
        fireEvent.click(screen.getByRole('button', { name: 'Clear cart' }));

        expect(screen.getByTestId('cart-items')).toBeEmptyDOMElement();
    });
});
