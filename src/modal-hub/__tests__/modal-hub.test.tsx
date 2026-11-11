import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { axe } from '@/test/axe';

import { ModalHub, ModalProvider } from '../index';

describe('ModalHub', () => {
    it('has no axe violations when no modal is open', async () => {
        const { container } = render(
            <ModalProvider>
                <ModalHub />
            </ModalProvider>
        );

        expect(await axe(container)).toHaveNoViolations();
    });
});
