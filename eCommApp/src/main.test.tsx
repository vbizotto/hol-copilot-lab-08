import { beforeEach, describe, expect, it, vi } from 'vitest';

const { createRootMock, renderMock } = vi.hoisted(() => ({
    createRootMock: vi.fn(),
    renderMock: vi.fn(),
}));

vi.mock('react-dom/client', () => ({
    default: { createRoot: createRootMock },
}));

describe('application entry point', () => {
    beforeEach(() => {
        vi.resetModules();
        createRootMock.mockReset();
        renderMock.mockReset();
        createRootMock.mockReturnValue({ render: renderMock });
    });

    it('mounts the application into the root element', async () => {
        const root = document.createElement('div');
        root.id = 'root';
        document.body.append(root);

        await import('./main');

        expect(createRootMock).toHaveBeenCalledWith(root);
        expect(renderMock).toHaveBeenCalledOnce();
    });
});
