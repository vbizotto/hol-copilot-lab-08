import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Footer from './Footer';

describe('Footer', () => {
    it('shows the store copyright notice', () => {
        render(<Footer />);

        expect(
            screen.getByText('© 2025 The Daily Harvest. All rights reserved.')
        ).toBeInTheDocument();
    });
});
