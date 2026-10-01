import { type Ref } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { supportRefFor } from './index';

const Probe = ({ ref }: { ref?: Ref<HTMLDivElement> }) => <div ref={ref} data-test-id="probe" />;

describe('supportRefFor', () => {
    it('returns the same component when the major is 19 or newer', () => {
        expect(supportRefFor(19, Probe)).toBe(Probe);
        expect(supportRefFor(20, Probe)).toBe(Probe);
    });

    it('forwards a callback ref when the major is 18', () => {
        const Wrapped = supportRefFor(18, Probe);
        const ref = vi.fn();

        render(<Wrapped ref={ref} />);

        expect(ref).toHaveBeenCalledWith(screen.getByTestId('probe'));
    });
});
