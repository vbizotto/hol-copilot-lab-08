import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import CheckoutModal from './CheckoutModal';

describe('Modal de checkout', () => {
    // Verifica a mensagem de confirmação e que aceitar chama somente a ação de confirmar.
    it('exibe a confirmação e chama onConfirm quando o checkout é aceito', () => {
        const onConfirm = vi.fn();
        const onCancel = vi.fn();

        render(<CheckoutModal onConfirm={onConfirm} onCancel={onCancel} />);

        expect(screen.getByRole('heading', { name: 'Are you sure?' })).toBeInTheDocument();
        expect(screen.getByText('Do you want to proceed with the checkout?')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Continue Checkout' }));

        expect(onConfirm).toHaveBeenCalledOnce();
        expect(onCancel).not.toHaveBeenCalled();
    });

    // Verifica que retornar ao carrinho chama somente a ação de cancelar.
    it('chama onCancel quando a pessoa retorna ao carrinho', () => {
        const onConfirm = vi.fn();
        const onCancel = vi.fn();

        render(<CheckoutModal onConfirm={onConfirm} onCancel={onCancel} />);
        fireEvent.click(screen.getByRole('button', { name: 'Return to cart' }));

        expect(onCancel).toHaveBeenCalledOnce();
        expect(onConfirm).not.toHaveBeenCalled();
    });
});
