import { describe, expect, it } from 'vitest';
import { calculateTotal, formatPrice, validateEmail } from './helpers';

describe('formatPrice', () => {
    it('formats prices as US dollars with two decimal places', () => {
        expect(formatPrice(12)).toBe('$12.00');
        expect(formatPrice(12.5)).toBe('$12.50');
        expect(formatPrice(-3.25)).toBe('-$3.25');
    });
});

describe('calculateTotal', () => {
    it('returns zero for an empty cart', () => {
        expect(calculateTotal([])).toBe(0);
    });

    it('sums each item price multiplied by its quantity', () => {
        expect(calculateTotal([
            { price: 2.5, quantity: 2 },
            { price: 10, quantity: 1 },
        ])).toBe(15);
    });
});

describe('validateEmail', () => {
    it.each([
        'developer@example.com',
        'first.last+tag@example.co.uk',
    ])('accepts a valid email address: %s', (email) => {
        expect(validateEmail(email)).toBe(true);
    });

    it.each([
        '',
        'missing-at.example.com',
        'missing-domain@',
        'missing-tld@example',
        'contains spaces@example.com',
    ])('rejects an invalid email address: %s', (email) => {
        expect(validateEmail(email)).toBe(false);
    });
});
