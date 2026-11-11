import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { axe } from '@/test/axe';

import { ComboboxListStatus } from '../index';

describe('Combobox', () => {
    it('has no axe violations on the empty list status', async () => {
        const { container } = render(<ComboboxListStatus isEmpty />);

        expect(await axe(container)).toHaveNoViolations();
    });
});
