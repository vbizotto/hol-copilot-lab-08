import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import LoginPage from './LoginPage';

const renderLoginPage = () => render(
    <MemoryRouter initialEntries={['/login']}>
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<h1>Admin dashboard</h1>} />
        </Routes>
    </MemoryRouter>
);

describe('LoginPage', () => {
    it('reports invalid credentials without navigating away', () => {
        renderLoginPage();

        fireEvent.change(screen.getByPlaceholderText('Username'), {
            target: { value: 'someone' },
        });
        fireEvent.change(screen.getByPlaceholderText('Password'), {
            target: { value: 'incorrect' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Login' }));

        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Admin Login' })).toBeInTheDocument();
    });

    it('navigates to the admin page and clears the form after a successful login', () => {
        renderLoginPage();

        const username = screen.getByPlaceholderText('Username');
        const password = screen.getByPlaceholderText('Password');
        fireEvent.change(username, { target: { value: 'admin' } });
        fireEvent.change(password, { target: { value: 'admin' } });
        fireEvent.click(screen.getByRole('button', { name: 'Login' }));

        expect(screen.getByRole('heading', { name: 'Admin dashboard' })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'Admin Login' })).not.toBeInTheDocument();
    });
});
