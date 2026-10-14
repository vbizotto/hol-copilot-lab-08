import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import CheckoutModal from './CheckoutModal';

describe('CheckoutModal', () => {
    it('shows the confirmation prompt and calls onConfirm when accepted', () => {
        const onConfirm = vi.fn();
        const onCancel = vi.fn();

        render(<CheckoutModal onConfirm={onConfirm} onCancel={onCancel} />);

        expect(screen.getByRole('heading', { name: 'Are you sure?' })).toBeInTheDocument();
        expect(screen.getByText('Do you want to proceed with the checkout?')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Continue Checkout' }));

        expect(onConfirm).toHaveBeenCalledOnce();
        expect(onCancel).not.toHaveBeenCalled();
    });

    it('calls onCancel when the customer returns to the cart', () => {
        const onConfirm = vi.fn();
        const onCancel = vi.fn();

        render(<CheckoutModal onConfirm={onConfirm} onCancel={onCancel} />);
        fireEvent.click(screen.getByRole('button', { name: 'Return to cart' }));

        expect(onCancel).toHaveBeenCalledOnce();
        expect(onConfirm).not.toHaveBeenCalled();
    });
});
