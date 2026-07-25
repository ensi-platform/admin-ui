import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Check, ChevronDown, Clear } from '..';

describe('icons', () => {
    it.each([
        ['Check', Check],
        ['ChevronDown', ChevronDown],
        ['Clear', Clear],
    ] as const)('%s renders title and skips aria-hidden when title is set', (_name, Icon) => {
        const { container } = render(<Icon title="Icon label" />);

        const svg = container.querySelector('svg');

        expect(svg).not.toHaveAttribute('aria-hidden', 'true');
        expect(screen.getByTitle('Icon label')).toBeInTheDocument();
    });
});
