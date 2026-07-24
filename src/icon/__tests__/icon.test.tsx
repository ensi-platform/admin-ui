import { type SVGProps } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Icon } from '../index';

import styles from '../styles.module.css';

const TestIcon = (props: SVGProps<SVGSVGElement>) => <svg data-test-id="test-icon" {...props} />;

describe('Icon', () => {
    it('renders Component with root class and a11y attrs', () => {
        render(<Icon Component={TestIcon} />);

        const icon = screen.getByTestId('test-icon');

        expect(icon).toHaveClass(styles.root);
        expect(icon).toHaveAttribute('aria-hidden', 'true');
        expect(icon).toHaveAttribute('focusable', 'false');
    });

    it('applies size and fill as CSS variables', () => {
        render(<Icon Component={TestIcon} size={20} fill="#3d3d3d" />);

        const icon = screen.getByTestId('test-icon');

        expect(icon).toHaveStyle({ '--icon-size': '20px', '--icon-fill': '#3d3d3d' });
    });

    it('merges className', () => {
        render(<Icon Component={TestIcon} className="extra" />);

        expect(screen.getByTestId('test-icon')).toHaveClass(styles.root, 'extra');
    });
});
