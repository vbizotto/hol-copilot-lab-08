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
    // Verifica se a página informa claramente quando é renderizada sem o provedor do carrinho.
    it('lança um erro claro quando renderizada sem o provedor do carrinho', () => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

        try {
            expect(() => render(
                <MemoryRouter>
                    <ProductsPage />
                </MemoryRouter>
            )).toThrow('CartContext deve ser usado dentro de um CartProvider');
        } finally {
            consoleError.mockRestore();
        }
    });

    // Verifica carregamento do catálogo, estado do estoque, inclusão no carrinho e envio de avaliação.
    it('carrega os produtos, informa o estoque, adiciona itens disponíveis e aceita uma avaliação', async () => {
        mockProductFetch();
        const addToCart = vi.fn();
        renderProductsPage(addToCart);

        expect(screen.getByText('Carregando produtos...')).toBeInTheDocument();
        expect(await screen.findByRole('heading', { name: 'Nossos produtos' })).toBeInTheDocument();
        expect(screen.getByText('A crisp snack')).toBeInTheDocument();
        expect(screen.getByRole('img', { name: 'Apple' })).toHaveAttribute(
            'src',
            'products/productImages/apple.png'
        );
        expect(screen.getByRole('button', { name: 'Fora de estoque' })).toBeDisabled();

        fireEvent.click(screen.getAllByRole('button', { name: 'Adicionar ao carrinho' })[0]);
        expect(addToCart).toHaveBeenCalledWith(products[0]);

        fireEvent.click(screen.getByRole('img', { name: 'Apple' }));
        expect(screen.getByRole('heading', { name: 'Avaliações de Apple' })).toBeInTheDocument();
        expect(screen.getByText('Ainda não há avaliações.')).toBeInTheDocument();
        fireEvent.change(screen.getByPlaceholderText('Seu nome'), {
            target: { value: 'Casey' },
        });
        fireEvent.change(screen.getByPlaceholderText('Sua avaliação'), {
            target: { value: 'Delicious' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Enviar' }));

        expect(screen.getByText('Casey')).toBeInTheDocument();
        expect(screen.getByText('Delicious')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Fechar' }));
        expect(screen.queryByRole('heading', { name: 'Avaliações de Apple' })).not.toBeInTheDocument();
    }, 15000);

    // Verifica se um erro de rede é registrado e se a página encerra o estado de carregamento.
    it('registra um erro ao carregar produtos e encerra o estado de carregamento', async () => {
        const error = new Error('Network unavailable');
        vi.spyOn(globalThis, 'fetch').mockRejectedValue(error);
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

        renderProductsPage();

        await waitFor(() => {
            expect(screen.queryByText('Carregando produtos...')).not.toBeInTheDocument();
        });

        expect(consoleError).toHaveBeenCalledWith('Erro ao carregar produtos:', error);
        expect(screen.getByRole('heading', { name: 'Nossos produtos' })).toBeInTheDocument();
        expect(screen.queryByText('Apple')).not.toBeInTheDocument();
        consoleError.mockRestore();
    });

    // Verifica se uma resposta HTTP malsucedida é registrada e não exibe produtos incompletos.
    it('registra uma resposta malsucedida sem exibir um catálogo incompleto', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('', { status: 503, statusText: 'Service Unavailable' })
        );
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

        renderProductsPage();

        await waitFor(() => {
            expect(screen.queryByText('Carregando produtos...')).not.toBeInTheDocument();
        });

        expect(consoleError).toHaveBeenCalledWith(
            'Erro ao carregar produtos:',
            new Error('Falha ao carregar apple.json')
        );
        expect(screen.queryByRole('button', { name: 'Adicionar ao carrinho' })).not.toBeInTheDocument();
        consoleError.mockRestore();
    });
});
