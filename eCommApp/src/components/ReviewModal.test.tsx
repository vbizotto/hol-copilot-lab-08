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

describe('Modal de avaliações', () => {
    // Verifica que o modal não é exibido quando nenhum produto está selecionado.
    it('não renderiza conteúdo quando nenhum produto está selecionado', () => {
        const { container } = render(
            <ReviewModal product={null} onClose={vi.fn()} onSubmit={vi.fn()} />
        );

        expect(container).toBeEmptyDOMElement();
    });

    // Verifica a exibição de avaliações existentes, o envio de uma nova avaliação e a limpeza do formulário.
    it('exibe avaliações existentes e envia uma nova avaliação com data ISO', () => {
        const onSubmit = vi.fn<(review: Review) => void>();

        render(
            <ReviewModal product={product} onClose={vi.fn()} onSubmit={onSubmit} />
        );

        expect(screen.getByRole('heading', { name: 'Avaliações de Apple' })).toBeInTheDocument();
        expect(screen.getByText('Taylor')).toBeInTheDocument();
        expect(screen.getByText('Fresh and crisp')).toBeInTheDocument();

        fireEvent.change(screen.getByPlaceholderText('Seu nome'), {
            target: { value: 'Jordan' },
        });
        fireEvent.change(screen.getByPlaceholderText('Sua avaliação'), {
            target: { value: 'Great taste' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Enviar' }));

        expect(onSubmit).toHaveBeenCalledOnce();
        const submittedReview = onSubmit.mock.calls[0][0];
        expect(submittedReview).toMatchObject({
            author: 'Jordan',
            comment: 'Great taste',
        });
        expect(Number.isNaN(Date.parse(submittedReview.date))).toBe(false);
        expect(screen.getByPlaceholderText('Seu nome')).toHaveValue('');
        expect(screen.getByPlaceholderText('Sua avaliação')).toHaveValue('');
    });

    // Verifica o estado sem avaliações e que o modal fecha pelo fundo ou pelo botão de fechar.
    it('exibe o estado sem avaliações e fecha ao clicar no fundo ou no botão de fechar', () => {
        const onClose = vi.fn();
        const { container } = render(
            <ReviewModal
                product={{ ...product, reviews: [] }}
                onClose={onClose}
                onSubmit={vi.fn()}
            />
        );

        expect(screen.getByText('Ainda não há avaliações.')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('heading', { name: 'Avaliações de Apple' }));
        expect(onClose).not.toHaveBeenCalled();

        const backdrop = container.querySelector('.modal-backdrop');
        expect(backdrop).not.toBeNull();
        if (backdrop) {
            fireEvent.click(backdrop);
        }
        expect(onClose).toHaveBeenCalledOnce();

        fireEvent.click(screen.getByRole('button', { name: 'Fechar' }));
        expect(onClose).toHaveBeenCalledTimes(2);
    });
});
