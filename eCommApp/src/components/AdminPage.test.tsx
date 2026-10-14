import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import AdminPage from './AdminPage';

const renderAdminPage = () => render(
    <MemoryRouter>
        <AdminPage />
    </MemoryRouter>
);

describe('AdminPage', () => {
    it('shows the initial state with no active sale', () => {
        renderAdminPage();

        expect(screen.getByRole('heading', { name: 'Welcome to the admin portal.' })).toBeInTheDocument();
        expect(screen.getByText('No sale active.')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Back to Storefront' })).toHaveAttribute('href', '/');
    });

    it('activates a sale for a valid numeric percentage and ends the sale', () => {
        renderAdminPage();

        fireEvent.change(screen.getByLabelText('Set Sale Percent (% off for all items):'), {
            target: { value: '25' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

        expect(screen.getByText('All products are 25% off!')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'End Sale' }));

        expect(screen.getByText('No sale active.')).toBeInTheDocument();
        expect(screen.getByLabelText('Set Sale Percent (% off for all items):')).toHaveValue('0');
    });

    it('displays an error when the sale percentage is not numeric', () => {
        renderAdminPage();

        fireEvent.change(screen.getByLabelText('Set Sale Percent (% off for all items):'), {
            target: { value: 'not-a-number' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

        expect(screen.getByText(/Invalid input/)).toBeInTheDocument();
        expect(screen.getByText(/Please enter a valid number/)).toBeInTheDocument();
        expect(screen.getByText('No sale active.')).toBeInTheDocument();
    });
});
