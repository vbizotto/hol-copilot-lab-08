import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Product, Review } from '../types';
import ReviewModal from './ReviewModal';

const product: Product = {
    id: 'apple',
    name: 'Apple',
    price: 1.5,
    reviews: [
        {
            author: 'Taylor',
            comment: 'Fresh and crisp',
            date: '2025-01-15T12:00:00.000Z',
        },
    ],
    inStock: true,
};

describe('ReviewModal', () => {
    it('renders nothing when no product is selected', () => {
        const { container } = render(
            <ReviewModal product={null} onClose={vi.fn()} onSubmit={vi.fn()} />
        );

        expect(container).toBeEmptyDOMElement();
    });

    it('shows existing reviews and submits a new review with an ISO date', () => {
        const onSubmit = vi.fn<(review: Review) => void>();

        render(
            <ReviewModal product={product} onClose={vi.fn()} onSubmit={onSubmit} />
        );

        expect(screen.getByRole('heading', { name: 'Reviews for Apple' })).toBeInTheDocument();
        expect(screen.getByText('Taylor')).toBeInTheDocument();
        expect(screen.getByText('Fresh and crisp')).toBeInTheDocument();

        fireEvent.change(screen.getByPlaceholderText('Your name'), {
            target: { value: 'Jordan' },
        });
        fireEvent.change(screen.getByPlaceholderText('Your review'), {
            target: { value: 'Great taste' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

        expect(onSubmit).toHaveBeenCalledOnce();
        const submittedReview = onSubmit.mock.calls[0][0];
        expect(submittedReview).toMatchObject({
            author: 'Jordan',
            comment: 'Great taste',
        });
        expect(Number.isNaN(Date.parse(submittedReview.date))).toBe(false);
        expect(screen.getByPlaceholderText('Your name')).toHaveValue('');
        expect(screen.getByPlaceholderText('Your review')).toHaveValue('');
    });

    it('shows the empty state and closes only when the backdrop or close button is clicked', () => {
        const onClose = vi.fn();
        const { container } = render(
            <ReviewModal
                product={{ ...product, reviews: [] }}
                onClose={onClose}
                onSubmit={vi.fn()}
            />
        );

        expect(screen.getByText('No reviews yet.')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('heading', { name: 'Reviews for Apple' }));
        expect(onClose).not.toHaveBeenCalled();

        const backdrop = container.querySelector('.modal-backdrop');
        expect(backdrop).not.toBeNull();
        if (backdrop) {
            fireEvent.click(backdrop);
        }
        expect(onClose).toHaveBeenCalledOnce();

        fireEvent.click(screen.getByRole('button', { name: 'Close' }));
        expect(onClose).toHaveBeenCalledTimes(2);
    });
});
