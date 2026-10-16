import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import RegisterPage from './RegisterPage';

describe('RegisterPage', () => {
    it('renders required username and password fields', () => {
        render(
            <MemoryRouter>
                <RegisterPage />
            </MemoryRouter>
        );

        expect(screen.getByRole('heading', { name: 'Cadastrar usuário' })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: 'Usuário' })).toBeRequired();
        expect(screen.getByLabelText('Senha')).toHaveAttribute('type', 'password');
        expect(screen.getByLabelText('Senha')).toBeRequired();
    });

    it('blocks submission when the required fields are empty', async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <RegisterPage />
            </MemoryRouter>
        );

        await user.click(screen.getByRole('button', { name: 'Cadastrar' }));

        expect(screen.getByRole('textbox', { name: 'Usuário' })).toBeInvalid();
        expect(screen.getByLabelText('Senha')).toBeInvalid();
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('does not claim to save an account before authentication is integrated', async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <RegisterPage />
            </MemoryRouter>
        );

        await user.type(screen.getByRole('textbox', { name: 'Usuário' }), 'cliente');
        await user.type(screen.getByLabelText('Senha'), 'senha-segura');
        await user.click(screen.getByRole('button', { name: 'Cadastrar' }));

        expect(screen.getByRole('status')).toHaveTextContent('Cadastro não salvo');
    });
});